/**
 * Logger Utility
 * Provides environment-aware logging
 * - Logs errors in both development and production
 * - Logs debug/info only in development
 * - Structured logging format
 */

const isDev = process.env.NODE_ENV === 'development';

const logger = {
  /**
   * Log error messages (always logs)
   */
  error: (context, message, error = null) => {
    const timestamp = new Date().toISOString();
    const errorData = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: isDev ? error.stack : undefined
    } : error;

    console.error(`[${timestamp}] ERROR [${context}]: ${message}`, errorData || '');
  },

  /**
   * Log warning messages (always logs)
   */
  warn: (context, message, data = null) => {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] WARN [${context}]: ${message}`, data || '');
  },

  /**
   * Log info messages (development only)
   */
  info: (context, message, data = null) => {
    if (!isDev) return;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] INFO [${context}]: ${message}`, data || '');
  },

  /**
   * Log debug messages (development only)
   */
  debug: (context, message, data = null) => {
    if (!isDev) return;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] DEBUG [${context}]: ${message}`, data || '');
  },

  /**
   * Log performance metrics (development only)
   */
  perf: (context, label, duration) => {
    if (!isDev) return;
    console.log(`[PERF] ${context}: ${label} took ${duration}ms`);
  }
};

export default logger;
