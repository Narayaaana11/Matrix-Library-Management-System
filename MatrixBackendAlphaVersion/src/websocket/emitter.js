/**
 * MATRIX LMS - WebSocket Emitter Helpers
 * Utility functions for controllers to emit WebSocket events
 * 
 * Usage in controllers:
 * const { emitBookBorrowed, emitNotification } = require('../websocket/emitter');
 * emitBookBorrowed({ studentId, bookId, ... });
 */

const { wsEventBus } = require('./wsServer');
const { WS_EVENTS } = require('./eventSchema');

/**
 * ==========================================
 * SCANNER & ATTENDANCE EMITTERS
 * ==========================================
 */

const emitCheckin = (data) => {
    wsEventBus.emit('scanner:checkin', {
        userId: data.userId || data._id,
        rollNumber: data.rollNumber,
        name: data.name,
        section: data.section,
        timeIn: data.timeIn,
        date: data.date,
        status: 'Checked In',
        isStudySection: data.isStudySection || false
    });
};

const emitCheckout = (data) => {
    wsEventBus.emit('scanner:checkout', {
        userId: data.userId || data._id,
        rollNumber: data.rollNumber,
        name: data.name,
        section: data.section,
        timeIn: data.timeIn,
        timeOut: data.timeOut,
        duration: data.duration,
        date: data.date,
        status: 'Checked Out',
        isStudySection: data.isStudySection || false
    });
};

/**
 * ==========================================
 * BOOK & LIBRARY EMITTERS
 * ==========================================
 */

const emitBookBorrowed = (data) => {
    wsEventBus.emit('book:borrowed', {
        studentId: data.student._id || data.student,
        studentName: data.student.name,
        rollNumber: data.student.rollNumber,
        bookId: data.book.id || data.book,
        bookTitle: data.book.title,
        borrowDate: data.borrowDate,
        dueDate: data.dueDate,
        issuedBy: data.issuedBy,
        conditionAtIssue: data.conditionAtIssue
    });
};

const emitBookReturned = (data) => {
    wsEventBus.emit('book:returned', {
        studentId: data.student._id || data.student,
        studentName: data.student.name,
        rollNumber: data.student.rollNumber,
        bookId: data.book.id || data.book,
        bookTitle: data.book.title,
        borrowDate: data.borrowDate,
        returnDate: data.returnDate,
        fine: data.fine || 0,
        paymentStatus: data.paymentStatus
    });
};

const emitBookOverdue = (data) => {
    wsEventBus.emit('book:overdue', {
        studentId: data.student._id || data.student,
        studentName: data.student.name,
        rollNumber: data.student.rollNumber,
        bookId: data.book.id || data.book,
        bookTitle: data.book.title,
        dueDate: data.dueDate,
        daysOverdue: data.daysOverdue,
        fine: data.fine
    });
};

const emitBookDueSoon = (data) => {
    wsEventBus.emit('book:due_soon', {
        studentId: data.student._id || data.student,
        bookId: data.book.id || data.book,
        bookTitle: data.book.title,
        dueDate: data.dueDate,
        daysRemaining: data.daysRemaining
    });
};

const emitBookAvailabilityChanged = (data) => {
    wsEventBus.emit('book:availability_changed', {
        bookId: data.bookId,
        bookTitle: data.title,
        previousStatus: data.previousStatus,
        newStatus: data.status,
        available: data.available,
        copies: data.copies
    });
};

/**
 * ==========================================
 * NOTIFICATION EMITTERS
 * ==========================================
 */

const emitNotification = (data) => {
    wsEventBus.emit('notification:new', {
        userId: data.user || data.userId,
        message: data.message,
        type: data.type || 'info',
        read: false,
        meta: data.meta || {},
        _id: data._id
    });
};

const emitBulkNotifications = (notifications) => {
    notifications.forEach(notification => {
        emitNotification(notification);
    });
};

/**
 * ==========================================
 * FORM SUBMISSION EMITTERS
 * ==========================================
 */

const emitFormSubmitted = (data) => {
    wsEventBus.emit('form:submitted', {
        studentId: data.student._id || data.student,
        studentName: data.student.name,
        rollNumber: data.student.rollNumber,
        formId: data.form._id || data.form,
        formTitle: data.form.title,
        submittedAt: data.createdAt || new Date(),
        responses: data.responses
    });
};

const emitFormApproved = (data) => {
    wsEventBus.emit('form:approved', {
        studentId: data.student._id || data.student,
        formId: data.form._id || data.form,
        formTitle: data.form.title,
        approvedBy: data.approvedBy,
        approvedAt: data.approvedAt || new Date(),
        remarks: data.remarks || ''
    });
};

const emitFormRejected = (data) => {
    wsEventBus.emit('form:rejected', {
        studentId: data.student._id || data.student,
        formId: data.form._id || data.form,
        formTitle: data.form.title,
        rejectedBy: data.rejectedBy,
        rejectedAt: data.rejectedAt || new Date(),
        reason: data.reason || ''
    });
};

/**
 * ==========================================
 * ANALYTICS EMITTERS
 * ==========================================
 */

const emitAnalyticsUpdate = (type, data) => {
    wsEventBus.emit('analytics:update', {
        type, // 'borrow', 'return', 'checkin', 'checkout'
        data,
        timestamp: Date.now()
    });
};

const emitAnalyticsStats = (stats) => {
    wsEventBus.emit('analytics:stats', {
        ...stats,
        timestamp: Date.now()
    });
};

const emitLeaderboardUpdate = (leaderboard) => {
    wsEventBus.emit('analytics:leaderboard_update', {
        leaderboard,
        timestamp: Date.now()
    });
};

/**
 * ==========================================
 * USER & ACTIVITY EMITTERS
 * ==========================================
 */

const emitUserStatusChange = (data) => {
    wsEventBus.emit('user:status', {
        userId: data.userId,
        name: data.name,
        rollNumber: data.rollNumber,
        status: data.status, // 'online' | 'offline'
        timestamp: Date.now()
    });
};

const emitActivityUpdate = (data) => {
    wsEventBus.emit('activity:update', {
        userId: data.userId,
        activityType: data.type,
        details: data.details,
        timestamp: Date.now()
    });
};

/**
 * ==========================================
 * SYSTEM EMITTERS
 * ==========================================
 */

const emitSystemAnnouncement = (data) => {
    wsEventBus.emit('system:announcement', {
        message: data.message,
        type: data.type || 'info',
        priority: data.priority || 'medium',
        expiresAt: data.expiresAt,
        timestamp: Date.now()
    });
};

const emitMaintenanceNotice = (data) => {
    wsEventBus.emit('system:maintenance', {
        message: data.message,
        startTime: data.startTime,
        estimatedDuration: data.duration,
        affectedServices: data.services || [],
        timestamp: Date.now()
    });
};

/**
 * ==========================================
 * BATCH OPERATIONS
 * ==========================================
 */

const emitBatch = (events) => {
    events.forEach(({ event, data }) => {
        wsEventBus.emit(event, data);
    });
};

/**
 * ==========================================
 * UTILITY FUNCTIONS
 * ==========================================
 */

// Emit with delay (for scheduled notifications)
const emitDelayed = (eventName, data, delayMs) => {
    setTimeout(() => {
        wsEventBus.emit(eventName, data);
    }, delayMs);
};

// Emit with retry logic (for critical events)
const emitWithRetry = async (eventName, data, maxRetries = 3) => {
    let retries = 0;
    while (retries < maxRetries) {
        try {
            wsEventBus.emit(eventName, data);
            return true;
        } catch (error) {
            console.error(`Failed to emit ${eventName}, retry ${retries + 1}/${maxRetries}`, error);
            retries++;
            await new Promise(resolve => setTimeout(resolve, 1000 * retries)); // Exponential backoff
        }
    }
    return false;
};

module.exports = {
    // Scanner
    emitCheckin,
    emitCheckout,

    // Books
    emitBookBorrowed,
    emitBookReturned,
    emitBookOverdue,
    emitBookDueSoon,
    emitBookAvailabilityChanged,

    // Notifications
    emitNotification,
    emitBulkNotifications,

    // Forms
    emitFormSubmitted,
    emitFormApproved,
    emitFormRejected,

    // Analytics
    emitAnalyticsUpdate,
    emitAnalyticsStats,
    emitLeaderboardUpdate,

    // User & Activity
    emitUserStatusChange,
    emitActivityUpdate,

    // System
    emitSystemAnnouncement,
    emitMaintenanceNotice,

    // Utilities
    emitBatch,
    emitDelayed,
    emitWithRetry
};
