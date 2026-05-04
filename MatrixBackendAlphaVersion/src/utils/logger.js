const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

const getLogLevel = () => {
  const envLevel = process.env.LOG_LEVEL || 'INFO';
  const levels = { ERROR: 4, WARN: 3, INFO: 2, DEBUG: 1 };
  return levels[envLevel] || 2;
};

const getTimestamp = () => {
  return new Date().toISOString();
};

const formatLogMessage = (level, message, data = {}) => {
  return JSON.stringify({
    timestamp: getTimestamp(),
    level,
    message,
    ...data,
    environment: process.env.NODE_ENV || 'development'
  });
};

const writeToFile = (level, message, data) => {
  const logFile = path.join(
    logsDir,
    `${level.toLowerCase()}-${new Date().toISOString().split('T')[0]}.log`
  );
  const logMessage = formatLogMessage(level, message, data);
  
  fs.appendFile(logFile, logMessage + '\n', (err) => {
    if (err) console.error('Failed to write to log file:', err);
  });
};

const logger = {
  error: (message, data = {}) => {
    if (getLogLevel() >= LOG_LEVELS.ERROR) {
      console.error(`❌ [ERROR] ${message}`, data);
      writeToFile('ERROR', message, data);
    }
  },

  warn: (message, data = {}) => {
    if (getLogLevel() >= LOG_LEVELS.WARN) {
      console.warn(`⚠️ [WARN] ${message}`, data);
      writeToFile('WARN', message, data);
    }
  },

  info: (message, data = {}) => {
    if (getLogLevel() >= LOG_LEVELS.INFO) {
      console.log(`ℹ️ [INFO] ${message}`, data);
      writeToFile('INFO', message, data);
    }
  },

  debug: (message, data = {}) => {
    if (getLogLevel() >= LOG_LEVELS.DEBUG) {
      console.log(`🐛 [DEBUG] ${message}`, data);
      writeToFile('DEBUG', message, data);
    }
  }
};

module.exports = logger;
