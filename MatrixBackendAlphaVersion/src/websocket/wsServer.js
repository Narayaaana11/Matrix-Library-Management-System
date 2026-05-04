/**
 * MATRIX LMS - WebSocket Server
 * Production-Grade Real-Time Communication Layer
 * 
 * Architecture: Event-Driven, Room-Based, JWT-Authenticated
 * Protocol: Socket.IO v4 (WebSocket + HTTP long-polling fallback)
 * Scalability: Redis Adapter ready (horizontal scaling)
 */

const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { EventEmitter } = require('events');

// Global event bus for cross-module communication
const wsEventBus = new EventEmitter();
wsEventBus.setMaxListeners(100); // Handle high concurrent events

class WebSocketServer {
    constructor() {
        this.io = null;
        this.connectedClients = new Map(); // userId -> Set of socketIds
        this.socketToUser = new Map(); // socketId -> userId
        this.stats = {
            totalConnections: 0,
            activeConnections: 0,
            messagesSent: 0,
            messagesReceived: 0,
            errors: 0
        };
    }

    /**
     * Initialize WebSocket server attached to HTTP server
     * @param {http.Server} httpServer - Express HTTP server instance
     */
    initialize(httpServer) {
        this.io = new Server(httpServer, {
            cors: {
                origin: process.env.FRONTEND_URL || "http://localhost:3000",
                credentials: true,
                methods: ["GET", "POST"]
            },
            pingTimeout: 60000,
            pingInterval: 25000,
            transports: ['websocket', 'polling'],
            allowEIO3: true // Backward compatibility
        });

        this.setupMiddleware();
        this.setupConnectionHandlers();
        this.setupEventListeners();

        console.log('WebSocket Server initialized');
        return this.io;
    }

    /**
     * Authentication Middleware
     * Validates JWT token before allowing WebSocket connection
     */
    setupMiddleware() {
        this.io.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

                if (!token) {
                    return next(new Error('Authentication error: No token provided'));
                }

                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.id).select('-password');

                if (!user) {
                    return next(new Error('Authentication error: User not found'));
                }

                socket.userId = user._id.toString();
                socket.userRole = user.role;
                socket.userDetails = {
                    name: user.name,
                    email: user.email,
                    rollNumber: user.rollNumber,
                    role: user.role
                };

                this.stats.totalConnections++;
                next();
            } catch (error) {
                console.error('WebSocket auth error:', error.message);
                this.stats.errors++;
                next(new Error('Authentication error: Invalid token'));
            }
        });
    }

    /**
     * Connection Event Handlers
     * Manages socket lifecycle: connect, disconnect, reconnect
     */
    setupConnectionHandlers() {
        this.io.on('connection', (socket) => {
            this.handleConnection(socket);
            this.registerEventHandlers(socket);
            this.stats.activeConnections++;

            socket.on('disconnect', (reason) => {
                this.handleDisconnection(socket, reason);
            });

            socket.on('error', (error) => {
                console.error(`Socket error [${socket.id}]:`, error);
                this.stats.errors++;
            });
        });
    }

    /**
     * Handle new client connection
     */
    handleConnection(socket) {
        const userId = socket.userId;

        // Track user connections (multi-device support)
        if (!this.connectedClients.has(userId)) {
            this.connectedClients.set(userId, new Set());
        }
        this.connectedClients.get(userId).add(socket.id);
        this.socketToUser.set(socket.id, userId);

        // Join role-based rooms
        socket.join(`role:${socket.userRole}`);
        socket.join(`user:${userId}`);

        // Join module-specific rooms based on role
        this.joinModuleRooms(socket);

        console.log(`User connected: ${socket.userDetails.name} [${socket.userRole}] - Socket: ${socket.id}`);

        // Notify user of successful connection
        socket.emit('ws:connected', {
            message: 'Connected to MATRIX LMS real-time server',
            userId,
            role: socket.userRole,
            timestamp: Date.now()
        });

        // Broadcast user online status to admins
        this.broadcastToRole('admin', 'user:status', {
            userId,
            name: socket.userDetails.name,
            rollNumber: socket.userDetails.rollNumber,
            status: 'online',
            timestamp: Date.now()
        });
    }

    /**
     * Join module-specific rooms based on user role
     */
    joinModuleRooms(socket) {
        const { userRole } = socket;

        switch (userRole) {
            case 'admin':
                socket.join('analytics:live');
                socket.join('library:admin');
                socket.join('attendance:admin');
                socket.join('forms:admin');
                break;
            case 'student':
                socket.join('library:student');
                socket.join('progress:student');
                socket.join('notifications:student');
                break;
            case 'librarian':
                socket.join('library:librarian');
                socket.join('scanner:events');
                break;
            case 'faculty':
                socket.join('attendance:faculty');
                socket.join('progress:faculty');
                break;
        }
    }

    /**
     * Handle client disconnection
     */
    handleDisconnection(socket, reason) {
        const userId = socket.userId;

        if (this.connectedClients.has(userId)) {
            this.connectedClients.get(userId).delete(socket.id);

            // Remove user from tracking if all devices disconnected
            if (this.connectedClients.get(userId).size === 0) {
                this.connectedClients.delete(userId);

                // Broadcast offline status only when all sessions end
                this.broadcastToRole('admin', 'user:status', {
                    userId,
                    name: socket.userDetails.name,
                    rollNumber: socket.userDetails.rollNumber,
                    status: 'offline',
                    timestamp: Date.now()
                });
            }
        }

        this.socketToUser.delete(socket.id);
        this.stats.activeConnections--;

        console.log(`User disconnected: ${socket.userDetails.name} - Reason: ${reason}`);
    }

    /**
     * Register custom event handlers
     */
    registerEventHandlers(socket) {
        // Client heartbeat/ping
        socket.on('ping', () => {
            socket.emit('pong', { timestamp: Date.now() });
        });

        // Request current stats
        socket.on('stats:request', () => {
            socket.emit('stats:response', this.getStats());
        });

        // Mark notification as read (with acknowledgement)
        socket.on('notification:read', async (data, ack) => {
            try {
                // Emit to backend event bus for processing
                wsEventBus.emit('notification:read', { userId: socket.userId, ...data });
                if (ack) ack({ success: true });
            } catch (error) {
                if (ack) ack({ success: false, error: error.message });
            }
        });

        // Activity tracking (for analytics)
        socket.on('activity:track', (data) => {
            wsEventBus.emit('activity:track', {
                userId: socket.userId,
                role: socket.userRole,
                ...data
            });
        });
    }

    /**
     * Setup listeners for backend events (controllers emit, we broadcast)
     */
    setupEventListeners() {
        // Scanner events
        wsEventBus.on('scanner:checkin', (data) => {
            this.broadcastToRoles(['admin', 'librarian'], 'scanner:checkin', data);
            this.sendToUser(data.userId, 'scanner:checkin', data);
        });

        wsEventBus.on('scanner:checkout', (data) => {
            this.broadcastToRoles(['admin', 'librarian'], 'scanner:checkout', data);
            this.sendToUser(data.userId, 'scanner:checkout', data);
        });

        // Book borrow events
        wsEventBus.on('book:borrowed', (data) => {
            this.broadcastToRole('admin', 'book:borrowed', data);
            this.sendToUser(data.studentId, 'book:borrowed', data);
            this.io.to('analytics:live').emit('analytics:update', { type: 'borrow', data });
        });

        wsEventBus.on('book:returned', (data) => {
            this.broadcastToRole('admin', 'book:returned', data);
            this.sendToUser(data.studentId, 'book:returned', data);
            this.io.to('analytics:live').emit('analytics:update', { type: 'return', data });
        });

        wsEventBus.on('book:overdue', (data) => {
            this.sendToUser(data.studentId, 'book:overdue', data);
            this.broadcastToRole('admin', 'book:overdue', data);
        });

        // Notification events
        wsEventBus.on('notification:new', (data) => {
            this.sendToUser(data.userId, 'notification:new', data);
        });

        // Form submission events
        wsEventBus.on('form:submitted', (data) => {
            this.broadcastToRole('admin', 'form:submitted', data);
            this.sendToUser(data.studentId, 'form:submitted', { status: 'received' });
        });

        wsEventBus.on('form:approved', (data) => {
            this.sendToUser(data.studentId, 'form:approved', data);
        });

        wsEventBus.on('form:rejected', (data) => {
            this.sendToUser(data.studentId, 'form:rejected', data);
        });

        // Analytics updates (push live data to admin dashboard)
        wsEventBus.on('analytics:stats', (data) => {
            this.io.to('analytics:live').emit('analytics:stats', data);
        });

        // Activity log updates
        wsEventBus.on('activity:update', (data) => {
            this.broadcastToRole('admin', 'activity:update', data);
        });

        // System announcements
        wsEventBus.on('system:announcement', (data) => {
            this.io.emit('system:announcement', data);
        });
    }

    /**
     * Send message to specific user (all their connected devices)
     */
    sendToUser(userId, event, data) {
        const userIdStr = userId.toString();
        this.io.to(`user:${userIdStr}`).emit(event, {
            ...data,
            timestamp: Date.now()
        });
        this.stats.messagesSent++;
    }

    /**
     * Broadcast to all users with specific role
     */
    broadcastToRole(role, event, data) {
        this.io.to(`role:${role}`).emit(event, {
            ...data,
            timestamp: Date.now()
        });
        this.stats.messagesSent++;
    }

    /**
     * Broadcast to multiple roles
     */
    broadcastToRoles(roles, event, data) {
        roles.forEach(role => this.broadcastToRole(role, event, data));
    }

    /**
     * Broadcast to specific room
     */
    broadcastToRoom(room, event, data) {
        this.io.to(room).emit(event, {
            ...data,
            timestamp: Date.now()
        });
        this.stats.messagesSent++;
    }

    /**
     * Get server statistics
     */
    getStats() {
        return {
            ...this.stats,
            activeConnections: this.connectedClients.size,
            totalSockets: this.socketToUser.size,
            timestamp: Date.now()
        };
    }

    /**
     * Check if user is currently online
     */
    isUserOnline(userId) {
        return this.connectedClients.has(userId.toString());
    }

    /**
     * Get all online users
     */
    getOnlineUsers() {
        return Array.from(this.connectedClients.keys());
    }

    /**
     * Graceful shutdown
     */
    async shutdown() {
        console.log('🔄 Shutting down WebSocket server...');

        // Notify all clients
        this.io.emit('system:shutdown', {
            message: 'Server maintenance in progress. Please reconnect.',
            timestamp: Date.now()
        });

        // Close all connections
        await new Promise((resolve) => {
            this.io.close(() => {
                console.log('WebSocket server closed');
                resolve();
            });
        });
    }
}

// Singleton instance
const wsServer = new WebSocketServer();

module.exports = {
    wsServer,
    wsEventBus,
    initializeWebSocket: (httpServer) => wsServer.initialize(httpServer)
};
