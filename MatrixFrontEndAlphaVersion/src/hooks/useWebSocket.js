/**
 * MATRIX LMS - React WebSocket Hook
 * Production-grade WebSocket client with auto-reconnection and event handling
 * 
 * Usage:
 * const { socket, isConnected, emit, on, off } = useWebSocket();
 * 
 * on('book:borrowed', (data) => console.log(data));
 * emit('notification:read', { id: '123' });
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_WS_URL || 'http://localhost:5000';

const useWebSocket = (options = {}) => {
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState(null);
    const [reconnectAttempts, setReconnectAttempts] = useState(0);
    const socketRef = useRef(null);
    const listenersRef = useRef(new Map());
    const reconnectTimeoutRef = useRef(null);

    const {
        autoConnect = true,
        reconnect = true,
        reconnectDelay = 1000,
        maxReconnectAttempts = 5,
        onConnect = null,
        onDisconnect = null,
        onError = null
    } = options;

    /**
     * Initialize WebSocket connection
     */
    const connect = useCallback(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.warn('No auth token found, skipping WebSocket connection');
            setConnectionError('Authentication required');
            return;
        }

        // Clean up existing connection
        if (socketRef.current?.connected) {
            socketRef.current.disconnect();
        }

        // Create new socket instance
        socketRef.current = io(SOCKET_URL, {
            auth: { token },
            transports: ['websocket', 'polling'],
            reconnection: reconnect,
            reconnectionDelay,
            reconnectionAttempts: maxReconnectAttempts,
            timeout: 10000
        });

        // Connection established
        socketRef.current.on('connect', () => {
            console.log('✅ WebSocket connected:', socketRef.current.id);
            setIsConnected(true);
            setConnectionError(null);
            setReconnectAttempts(0);

            if (onConnect) onConnect();
        });

        // Connection error
        socketRef.current.on('connect_error', (error) => {
            console.error('❌ WebSocket connection error:', error.message);
            setIsConnected(false);
            setConnectionError(error.message);

            if (onError) onError(error);

            // Attempt manual reconnection if auto-reconnect fails
            if (reconnect && reconnectAttempts < maxReconnectAttempts) {
                setReconnectAttempts(prev => prev + 1);
                reconnectTimeoutRef.current = setTimeout(() => {
                    console.log(`🔄 Attempting reconnection (${reconnectAttempts + 1}/${maxReconnectAttempts})...`);
                    connect();
                }, reconnectDelay * Math.pow(2, reconnectAttempts)); // Exponential backoff
            }
        });

        // Disconnection
        socketRef.current.on('disconnect', (reason) => {
            console.log('🔌 WebSocket disconnected:', reason);
            setIsConnected(false);

            if (onDisconnect) onDisconnect(reason);

            // Auto-reconnect on unexpected disconnection
            if (reason === 'io server disconnect' || reason === 'transport close') {
                if (reconnect && reconnectAttempts < maxReconnectAttempts) {
                    connect();
                }
            }
        });

        // Welcome message from server
        socketRef.current.on('ws:connected', (data) => {
            console.log('📡 Server handshake:', data);
        });

        // Re-register all event listeners
        listenersRef.current.forEach((callbacks, eventName) => {
            callbacks.forEach(callback => {
                socketRef.current.on(eventName, callback);
            });
        });

    }, [reconnect, reconnectDelay, maxReconnectAttempts, reconnectAttempts, onConnect, onDisconnect, onError]);

    /**
     * Disconnect WebSocket
     */
    const disconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
        setIsConnected(false);
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
    }, []);

    /**
     * Emit event to server
     */
    const emit = useCallback((eventName, data, ack) => {
        if (!socketRef.current?.connected) {
            console.warn(`Cannot emit ${eventName}: Socket not connected`);
            return false;
        }

        if (ack) {
            socketRef.current.emit(eventName, data, ack);
        } else {
            socketRef.current.emit(eventName, data);
        }
        return true;
    }, []);

    /**
     * Register event listener
     */
    const on = useCallback((eventName, callback) => {
        if (!listenersRef.current.has(eventName)) {
            listenersRef.current.set(eventName, new Set());
        }
        listenersRef.current.get(eventName).add(callback);

        if (socketRef.current) {
            socketRef.current.on(eventName, callback);
        }

        // Return cleanup function
        return () => off(eventName, callback);
    }, []);

    /**
     * Remove event listener
     */
    const off = useCallback((eventName, callback) => {
        if (listenersRef.current.has(eventName)) {
            listenersRef.current.get(eventName).delete(callback);
            if (listenersRef.current.get(eventName).size === 0) {
                listenersRef.current.delete(eventName);
            }
        }

        if (socketRef.current) {
            socketRef.current.off(eventName, callback);
        }
    }, []);

    /**
     * Remove all listeners for an event
     */
    const removeAllListeners = useCallback((eventName) => {
        if (eventName) {
            listenersRef.current.delete(eventName);
            if (socketRef.current) {
                socketRef.current.off(eventName);
            }
        } else {
            listenersRef.current.clear();
            if (socketRef.current) {
                socketRef.current.removeAllListeners();
            }
        }
    }, []);

    /**
     * Send ping to check connection
     */
    const ping = useCallback(() => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('ping');
        }
    }, []);

    // Auto-connect on mount
    useEffect(() => {
        if (autoConnect) {
            connect();
        }

        return () => {
            disconnect();
        };
    }, [autoConnect, connect, disconnect]);

    return {
        socket: socketRef.current,
        isConnected,
        connectionError,
        reconnectAttempts,
        connect,
        disconnect,
        emit,
        on,
        off,
        removeAllListeners,
        ping
    };
};

export default useWebSocket;
