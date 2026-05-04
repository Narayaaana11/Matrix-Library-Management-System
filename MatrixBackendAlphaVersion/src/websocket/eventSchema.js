/**
 * MATRIX LMS - WebSocket Event Schema
 * Complete event definitions for real-time communication
 * 
 * Event Naming Convention: <module>:<action>
 * Examples: scanner:checkin, book:borrowed, notification:new
 */

const WS_EVENTS = {
    // ============================================
    // CONNECTION & LIFECYCLE EVENTS
    // ============================================
    CONNECTION: {
        CONNECTED: 'ws:connected',
        DISCONNECTED: 'ws:disconnected',
        PING: 'ping',
        PONG: 'pong',
        ERROR: 'ws:error'
    },

    // ============================================
    // SCANNER & ATTENDANCE EVENTS
    // ============================================
    SCANNER: {
        // Server -> Client
        CHECKIN: 'scanner:checkin',
        CHECKOUT: 'scanner:checkout',
        ERROR: 'scanner:error',

        // Client -> Server
        SCAN_REQUEST: 'scanner:scan_request'
    },

    // ============================================
    // LIBRARY & BOOK MANAGEMENT EVENTS
    // ============================================
    BOOK: {
        // Server -> Client
        BORROWED: 'book:borrowed',
        RETURNED: 'book:returned',
        OVERDUE: 'book:overdue',
        DUE_SOON: 'book:due_soon',
        FINE_UPDATED: 'book:fine_updated',
        AVAILABILITY_CHANGED: 'book:availability_changed',

        // Real-time book search updates
        SEARCH_RESULT: 'book:search_result'
    },

    // ============================================
    // NOTIFICATION EVENTS
    // ============================================
    NOTIFICATION: {
        // Server -> Client
        NEW: 'notification:new',
        BULK_NEW: 'notification:bulk_new',

        // Client -> Server
        READ: 'notification:read',
        READ_ALL: 'notification:read_all',
        DELETE: 'notification:delete'
    },

    // ============================================
    // FORM SUBMISSION EVENTS
    // ============================================
    FORM: {
        // Server -> Client
        SUBMITTED: 'form:submitted',
        APPROVED: 'form:approved',
        REJECTED: 'form:rejected',
        UPDATED: 'form:updated',

        // Client -> Server
        SUBMIT: 'form:submit'
    },

    // ============================================
    // ANALYTICS & DASHBOARD EVENTS
    // ============================================
    ANALYTICS: {
        // Server -> Client
        STATS: 'analytics:stats',
        UPDATE: 'analytics:update',
        LEADERBOARD_UPDATE: 'analytics:leaderboard_update',
        TRAFFIC_UPDATE: 'analytics:traffic_update',

        // Client -> Server
        REQUEST: 'analytics:request',
        SUBSCRIBE: 'analytics:subscribe',
        UNSUBSCRIBE: 'analytics:unsubscribe'
    },

    // ============================================
    // USER STATUS & ACTIVITY EVENTS
    // ============================================
    USER: {
        // Server -> Client
        STATUS: 'user:status', // online/offline
        ACTIVITY_UPDATE: 'user:activity_update',
        PROFILE_UPDATED: 'user:profile_updated',

        // Client -> Server
        ACTIVITY_TRACK: 'activity:track'
    },

    // ============================================
    // SYSTEM EVENTS
    // ============================================
    SYSTEM: {
        ANNOUNCEMENT: 'system:announcement',
        MAINTENANCE: 'system:maintenance',
        SHUTDOWN: 'system:shutdown',
        UPDATE_AVAILABLE: 'system:update_available'
    },

    // ============================================
    // STATS & MONITORING EVENTS
    // ============================================
    STATS: {
        REQUEST: 'stats:request',
        RESPONSE: 'stats:response'
    }
};

// ============================================
// EVENT PAYLOAD SCHEMAS
// ============================================

const PAYLOAD_SCHEMAS = {
    // Scanner Check-in
    'scanner:checkin': {
        userId: 'string',
        rollNumber: 'string',
        name: 'string',
        section: 'string',
        timeIn: 'string',
        date: 'string',
        status: 'Checked In',
        timestamp: 'number'
    },

    // Scanner Check-out
    'scanner:checkout': {
        userId: 'string',
        rollNumber: 'string',
        name: 'string',
        section: 'string',
        timeIn: 'string',
        timeOut: 'string',
        duration: 'string',
        date: 'string',
        status: 'Checked Out',
        timestamp: 'number'
    },

    // Book Borrowed
    'book:borrowed': {
        studentId: 'string',
        studentName: 'string',
        rollNumber: 'string',
        bookId: 'string',
        bookTitle: 'string',
        borrowDate: 'date',
        dueDate: 'date',
        issuedBy: 'string',
        timestamp: 'number'
    },

    // Book Returned
    'book:returned': {
        studentId: 'string',
        studentName: 'string',
        rollNumber: 'string',
        bookId: 'string',
        bookTitle: 'string',
        returnDate: 'date',
        fine: 'number',
        timestamp: 'number'
    },

    // Book Overdue
    'book:overdue': {
        studentId: 'string',
        bookId: 'string',
        bookTitle: 'string',
        dueDate: 'date',
        daysOverdue: 'number',
        fine: 'number',
        timestamp: 'number'
    },

    // Notification
    'notification:new': {
        userId: 'string',
        message: 'string',
        type: 'info | success | warning | error | book | overdue | custom',
        read: 'boolean',
        meta: 'object',
        timestamp: 'number'
    },

    // Form Submitted
    'form:submitted': {
        studentId: 'string',
        studentName: 'string',
        rollNumber: 'string',
        formId: 'string',
        formTitle: 'string',
        submittedAt: 'date',
        timestamp: 'number'
    },

    // Form Approved/Rejected
    'form:approved': {
        studentId: 'string',
        formId: 'string',
        formTitle: 'string',
        approvedBy: 'string',
        approvedAt: 'date',
        remarks: 'string',
        timestamp: 'number'
    },

    // Analytics Stats
    'analytics:stats': {
        totalBooks: 'number',
        activeMembers: 'number',
        booksBorrowed: 'number',
        overdueBooks: 'number',
        totalIssued: 'number',
        totalReturned: 'number',
        totalFines: 'number',
        dailyTraffic: 'array',
        leaderboard: 'array',
        timestamp: 'number'
    },

    // User Status
    'user:status': {
        userId: 'string',
        name: 'string',
        rollNumber: 'string',
        status: 'online | offline',
        timestamp: 'number'
    },

    // System Announcement
    'system:announcement': {
        message: 'string',
        type: 'info | warning | critical',
        priority: 'low | medium | high',
        expiresAt: 'date',
        timestamp: 'number'
    }
};

// ============================================
// ROOM NAMING CONVENTIONS
// ============================================

const ROOMS = {
    // Role-based rooms
    ROLE: {
        ADMIN: 'role:admin',
        STUDENT: 'role:student',
        LIBRARIAN: 'role:librarian',
        FACULTY: 'role:faculty'
    },

    // Module-based rooms
    MODULE: {
        ANALYTICS: 'analytics:live',
        LIBRARY_ADMIN: 'library:admin',
        LIBRARY_STUDENT: 'library:student',
        LIBRARY_LIBRARIAN: 'library:librarian',
        SCANNER: 'scanner:events',
        ATTENDANCE_ADMIN: 'attendance:admin',
        ATTENDANCE_FACULTY: 'attendance:faculty',
        FORMS: 'forms:admin',
        NOTIFICATIONS: 'notifications:student',
        PROGRESS: 'progress:student'
    },

    // User-specific room (dynamic)
    user: (userId) => `user:${userId}`,

    // Session-specific room (dynamic)
    session: (sessionId) => `session:${sessionId}`
};

// ============================================
// EVENT PRIORITY LEVELS
// ============================================

const EVENT_PRIORITY = {
    CRITICAL: 3,    // System shutdown, critical errors
    HIGH: 2,        // Overdue books, urgent notifications
    MEDIUM: 1,      // Normal operations, updates
    LOW: 0          // Analytics, stats, background updates
};

// ============================================
// ERROR CODES
// ============================================

const WS_ERROR_CODES = {
    AUTH_FAILED: 'WS_AUTH_FAILED',
    INVALID_TOKEN: 'WS_INVALID_TOKEN',
    USER_NOT_FOUND: 'WS_USER_NOT_FOUND',
    PERMISSION_DENIED: 'WS_PERMISSION_DENIED',
    RATE_LIMIT: 'WS_RATE_LIMIT',
    INVALID_PAYLOAD: 'WS_INVALID_PAYLOAD',
    ROOM_NOT_FOUND: 'WS_ROOM_NOT_FOUND',
    CONNECTION_LOST: 'WS_CONNECTION_LOST',
    SERVER_ERROR: 'WS_SERVER_ERROR'
};

module.exports = {
    WS_EVENTS,
    PAYLOAD_SCHEMAS,
    ROOMS,
    EVENT_PRIORITY,
    WS_ERROR_CODES
};
