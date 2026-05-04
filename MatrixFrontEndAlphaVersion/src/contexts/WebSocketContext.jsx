/**
 * MATRIX LMS - WebSocket Context Provider
 * Global WebSocket state management for the entire application
 * 
 * Wrap your app with this provider:
 * <WebSocketProvider><App /></WebSocketProvider>
 * 
 * Use in components:
 * const { isConnected, on, emit } = useWebSocketContext();
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import useWebSocket from '../hooks/useWebSocket';
import { toast } from 'react-toastify';

const WebSocketContext = createContext(null);

export const useWebSocketContext = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocketContext must be used within WebSocketProvider');
    }
    return context;
};

export const WebSocketProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [systemAnnouncements, setSystemAnnouncements] = useState([]);

    const {
        socket,
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
    } = useWebSocket({
        autoConnect: true,
        reconnect: true,
        reconnectDelay: 1000,
        maxReconnectAttempts: 5,
        onConnect: () => {
            toast.success('Connected to real-time server', {
                position: 'bottom-right',
                autoClose: 2000
            });
        },
        onDisconnect: (reason) => {
            if (reason !== 'io client disconnect') {
                toast.warning('Disconnected from server', {
                    position: 'bottom-right',
                    autoClose: 3000
                });
            }
        },
        onError: (error) => {
            toast.error('Connection error: ' + error.message, {
                position: 'bottom-right',
                autoClose: 3000
            });
        }
    });

    /**
     * Setup global event listeners
     */
    useEffect(() => {
        if (!socket) return;

        // ==========================================
        // NOTIFICATION EVENTS
        // ==========================================
        const handleNewNotification = (data) => {
            setNotifications(prev => [data, ...prev]);

            // Show toast based on notification type
            const toastOptions = {
                position: 'top-right',
                autoClose: 5000
            };

            switch (data.type) {
                case 'success':
                    toast.success(data.message, toastOptions);
                    break;
                case 'warning':
                    toast.warning(data.message, toastOptions);
                    break;
                case 'error':
                    toast.error(data.message, toastOptions);
                    break;
                case 'overdue':
                    toast.warning(data.message, { ...toastOptions, autoClose: 8000 });
                    break;
                default:
                    toast.info(data.message, toastOptions);
            }
        };

        // ==========================================
        // USER STATUS EVENTS
        // ==========================================
        const handleUserStatus = (data) => {
            if (data.status === 'online') {
                setOnlineUsers(prev => [...prev.filter(u => u.userId !== data.userId), data]);
            } else {
                setOnlineUsers(prev => prev.filter(u => u.userId !== data.userId));
            }
        };

        // ==========================================
        // SYSTEM EVENTS
        // ==========================================
        const handleSystemAnnouncement = (data) => {
            setSystemAnnouncements(prev => [data, ...prev]);

            const toastOptions = {
                position: 'top-center',
                autoClose: data.type === 'critical' ? false : 10000,
                closeButton: true
            };

            if (data.priority === 'high' || data.type === 'critical') {
                toast.error(data.message, toastOptions);
            } else if (data.type === 'warning') {
                toast.warning(data.message, toastOptions);
            } else {
                toast.info(data.message, toastOptions);
            }
        };

        const handleMaintenanceNotice = (data) => {
            toast.warning(
                `Maintenance scheduled: ${data.message}. Estimated duration: ${data.estimatedDuration}`,
                {
                    position: 'top-center',
                    autoClose: false,
                    closeButton: true
                }
            );
        };

        const handleSystemShutdown = (data) => {
            toast.error(data.message, {
                position: 'top-center',
                autoClose: false,
                closeButton: false
            });
        };

        // ==========================================
        // BOOK EVENTS
        // ==========================================
        const handleBookBorrowed = (data) => {
            toast.success(
                `Book borrowed: ${data.bookTitle}. Due: ${new Date(data.dueDate).toLocaleDateString()}`,
                { autoClose: 5000 }
            );
        };

        const handleBookReturned = (data) => {
            const message = data.fine > 0
                ? `Book returned: ${data.bookTitle}. Fine: ₹${data.fine}`
                : `Book returned: ${data.bookTitle}`;

            toast.success(message, { autoClose: 5000 });
        };

        const handleBookOverdue = (data) => {
            toast.error(
                `Book overdue: ${data.bookTitle}. Fine: ₹${data.fine}`,
                { autoClose: 8000 }
            );
        };

        // ==========================================
        // SCANNER EVENTS
        // ==========================================
        const handleCheckin = (data) => {
            toast.info(
                `Checked in: ${data.section} at ${data.timeIn}`,
                { autoClose: 3000 }
            );
        };

        const handleCheckout = (data) => {
            toast.info(
                `Checked out: ${data.section}. Duration: ${data.duration}`,
                { autoClose: 3000 }
            );
        };

        // ==========================================
        // FORM EVENTS
        // ==========================================
        const handleFormApproved = (data) => {
            toast.success(
                `Form approved: ${data.formTitle}`,
                { autoClose: 5000 }
            );
        };

        const handleFormRejected = (data) => {
            toast.error(
                `Form rejected: ${data.formTitle}. Reason: ${data.reason}`,
                { autoClose: 8000 }
            );
        };

        // Register all listeners
        const cleanup1 = on('notification:new', handleNewNotification);
        const cleanup2 = on('user:status', handleUserStatus);
        const cleanup3 = on('system:announcement', handleSystemAnnouncement);
        const cleanup4 = on('system:maintenance', handleMaintenanceNotice);
        const cleanup5 = on('system:shutdown', handleSystemShutdown);
        const cleanup6 = on('book:borrowed', handleBookBorrowed);
        const cleanup7 = on('book:returned', handleBookReturned);
        const cleanup8 = on('book:overdue', handleBookOverdue);
        const cleanup9 = on('scanner:checkin', handleCheckin);
        const cleanup10 = on('scanner:checkout', handleCheckout);
        const cleanup11 = on('form:approved', handleFormApproved);
        const cleanup12 = on('form:rejected', handleFormRejected);

        // Cleanup on unmount
        return () => {
            cleanup1();
            cleanup2();
            cleanup3();
            cleanup4();
            cleanup5();
            cleanup6();
            cleanup7();
            cleanup8();
            cleanup9();
            cleanup10();
            cleanup11();
            cleanup12();
        };
    }, [socket, on]);

    /**
     * Mark notification as read
     */
    const markNotificationRead = (notificationId) => {
        emit('notification:read', { id: notificationId }, (response) => {
            if (response?.success) {
                setNotifications(prev =>
                    prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
                );
            }
        });
    };

    /**
     * Clear all notifications
     */
    const clearNotifications = () => {
        setNotifications([]);
    };

    const value = {
        // Connection state
        socket,
        isConnected,
        connectionError,
        reconnectAttempts,

        // Connection control
        connect,
        disconnect,
        ping,

        // Event handling
        emit,
        on,
        off,
        removeAllListeners,

        // State
        notifications,
        onlineUsers,
        systemAnnouncements,

        // Actions
        markNotificationRead,
        clearNotifications
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};

export default WebSocketProvider;
