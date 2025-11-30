/**
 * Session Management
 * 
 * Handles in-memory session storage with automatic cleanup.
 * Sessions expire after SESSION_MAX_AGE (default 24 hours).
 */

const crypto = require('crypto');

// In-memory session store
// Format: sessionId -> { encryptedApiKey, chatEndpoint, completionEndpoint, createdAt, lastUsedAt }
const sessions = new Map();

// Session configuration
const SESSION_MAX_AGE = parseInt(process.env.SESSION_MAX_AGE) || 24 * 60 * 60 * 1000; // 24 hours default
const CLEANUP_INTERVAL = 60 * 60 * 1000; // Run cleanup every hour

/**
 * Generate a cryptographically secure random session ID
 * @returns {string} 64-character hex string
 */
function generateSessionId() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Create a new session
 * @param {Object} sessionData - Session data to store
 * @param {string} sessionData.encryptedApiKey - Encrypted API key
 * @param {string} sessionData.chatEndpoint - Mistral chat endpoint URL
 * @param {string} [sessionData.completionEndpoint] - Mistral completion endpoint URL
 * @returns {string} Generated session ID
 */
function createSession(sessionData) {
  const sessionId = generateSessionId();
  const now = Date.now();
  
  sessions.set(sessionId, {
    ...sessionData,
    createdAt: now,
    lastUsedAt: now
  });
  
  console.log(`[Sessions] Created session ${sessionId} (Total: ${sessions.size})`);
  return sessionId;
}

/**
 * Get session data by ID
 * @param {string} sessionId - Session ID to retrieve
 * @returns {Object|null} Session data or null if not found/expired
 */
function getSession(sessionId) {
  if (!sessionId || !sessions.has(sessionId)) {
    return null;
  }
  
  const session = sessions.get(sessionId);
  const now = Date.now();
  
  // Check if session has expired
  if (now - session.lastUsedAt > SESSION_MAX_AGE) {
    console.log(`[Sessions] Session ${sessionId} expired`);
    sessions.delete(sessionId);
    return null;
  }
  
  // Update last used timestamp
  session.lastUsedAt = now;
  sessions.set(sessionId, session);
  
  return session;
}

/**
 * Delete a session
 * @param {string} sessionId - Session ID to delete
 * @returns {boolean} True if session was deleted, false if not found
 */
function deleteSession(sessionId) {
  const deleted = sessions.delete(sessionId);
  if (deleted) {
    console.log(`[Sessions] Deleted session ${sessionId} (Total: ${sessions.size})`);
  }
  return deleted;
}

/**
 * Clean up expired sessions
 * Automatically called periodically
 */
function cleanupExpiredSessions() {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.lastUsedAt > SESSION_MAX_AGE) {
      sessions.delete(sessionId);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    console.log(`[Sessions] Cleaned up ${cleaned} expired sessions (Remaining: ${sessions.size})`);
  }
}

/**
 * Get current session statistics
 * @returns {Object} Session stats
 */
function getStats() {
  return {
    totalSessions: sessions.size,
    maxAge: SESSION_MAX_AGE,
    cleanupInterval: CLEANUP_INTERVAL
  };
}

// Start automatic cleanup
setInterval(cleanupExpiredSessions, CLEANUP_INTERVAL);
console.log(`[Sessions] Auto-cleanup enabled (interval: ${CLEANUP_INTERVAL}ms, max age: ${SESSION_MAX_AGE}ms)`);

module.exports = {
  createSession,
  getSession,
  deleteSession,
  getStats
};