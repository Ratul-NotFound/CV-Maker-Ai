/**
 * Rate Limiting Utility
 * Simple in-memory rate limiting for API endpoints
 * Tracks requests per IP/user over time windows
 */

const requestMap = new Map(); // Maps "key:timestamp" -> count

/**
 * Check if request exceeds rate limit
 * @param {string} identifier - IP address or user ID
 * @param {number} maxRequests - Max requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} - True if request is allowed, false if rate limited
 */
export function checkRateLimit(identifier, maxRequests = 30, windowMs = 60000) {
  const now = Date.now();
  const key = identifier;
  
  // Clean up old entries
  for (const [storeKey, data] of requestMap.entries()) {
    if (now - data.firstRequest > windowMs) {
      requestMap.delete(storeKey);
    }
  }

  // Get or create request data
  if (!requestMap.has(key)) {
    requestMap.set(key, {
      count: 1,
      firstRequest: now
    });
    return true;
  }

  const data = requestMap.get(key);
  
  // Reset if outside window
  if (now - data.firstRequest > windowMs) {
    requestMap.set(key, {
      count: 1,
      firstRequest: now
    });
    return true;
  }

  // Check if within limit
  if (data.count < maxRequests) {
    data.count++;
    return true;
  }

  return false;
}

/**
 * Get remaining requests for identifier
 */
export function getRemainingRequests(identifier, maxRequests = 30, windowMs = 60000) {
  const now = Date.now();
  const key = identifier;

  if (!requestMap.has(key)) {
    return maxRequests;
  }

  const data = requestMap.get(key);
  
  // Reset if outside window
  if (now - data.firstRequest > windowMs) {
    return maxRequests;
  }

  return Math.max(0, maxRequests - data.count);
}

/**
 * Reset rate limit for identifier
 */
export function resetRateLimit(identifier) {
  requestMap.delete(identifier);
}

/**
 * Get IP address from request
 */
export function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || '127.0.0.1';
  return ip;
}
