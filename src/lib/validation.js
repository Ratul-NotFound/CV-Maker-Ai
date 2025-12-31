/**
 * Input Validation Utility
 * Provides safe input validation and sanitization
 */

export const validateInput = {
  /**
   * Validate required string field
   */
  string: (value, fieldName, maxLength = 500) => {
    if (typeof value !== 'string') {
      throw new Error(`${fieldName} must be a string`);
    }
    if (value.trim().length === 0) {
      throw new Error(`${fieldName} cannot be empty`);
    }
    if (value.length > maxLength) {
      throw new Error(`${fieldName} exceeds maximum length of ${maxLength}`);
    }
    return value.trim();
  },

  /**
   * Validate email format
   */
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new Error('Invalid email format');
    }
    return value.toLowerCase();
  },

  /**
   * Validate array of objects
   */
  array: (value, fieldName, minLength = 0) => {
    if (!Array.isArray(value)) {
      throw new Error(`${fieldName} must be an array`);
    }
    if (value.length < minLength) {
      throw new Error(`${fieldName} must have at least ${minLength} items`);
    }
    return value;
  },

  /**
   * Validate object structure
   */
  object: (value, fieldName, requiredKeys = []) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error(`${fieldName} must be a valid object`);
    }
    
    for (const key of requiredKeys) {
      if (!(key in value)) {
        throw new Error(`${fieldName} is missing required field: ${key}`);
      }
    }
    return value;
  },

  /**
   * Validate enum value
   */
  enum: (value, fieldName, allowedValues) => {
    if (!allowedValues.includes(value)) {
      throw new Error(`${fieldName} must be one of: ${allowedValues.join(', ')}`);
    }
    return value;
  },

  /**
   * Validate positive number
   */
  positiveNumber: (value, fieldName) => {
    const num = Number(value);
    if (isNaN(num) || num <= 0) {
      throw new Error(`${fieldName} must be a positive number`);
    }
    return num;
  },

  /**
   * Sanitize HTML content to prevent XSS
   */
  sanitizeHtml: (html) => {
    if (typeof html !== 'string') return '';
    
    // Basic HTML sanitization - remove script tags and event handlers
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
      .replace(/on\w+\s*=\s*'[^']*'/gi, '')
      .trim();
  },

  /**
   * Validate URL format
   */
  url: (value) => {
    try {
      new URL(value);
      return value;
    } catch {
      throw new Error('Invalid URL format');
    }
  }
};

/**
 * Safe handler wrapper that catches validation errors
 */
export const safeHandler = (handler) => {
  return async (request) => {
    try {
      return await handler(request);
    } catch (error) {
      if (error.message && error.message.includes('must be') || error.message.includes('Invalid')) {
        return new Response(JSON.stringify({
          success: false,
          error: error.message
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      throw error;
    }
  };
};
