/**
 * Mistral Codestral API Proxy Server
 * 
 * This server acts as a secure proxy between the browser and Mistral's API.
 * It stores encrypted API keys in server memory and uses HTTP-only cookies
 * to identify user sessions, preventing API key exposure in the browser.
 * 
 * Created by: Ashlolc, Perplexity, and Mistral
 */

require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { encrypt, decrypt } = require('./utils/encryption');
const { createSession, getSession, deleteSession, getStats } = require('./utils/sessions');

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';

// ============================================================================
// Middleware Configuration
// ============================================================================

// Enable CORS for frontend domain
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true // Allow cookies
}));

// Parse JSON request bodies
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================================================
// API Endpoints
// ============================================================================

/**
 * Health check endpoint
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
  const stats = getStats();
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    ...stats
  });
});

/**
 * Setup endpoint - Store encrypted API key and endpoints
 * POST /api/setup
 * Body: { apiKey, chatEndpoint, completionEndpoint }
 */
app.post('/api/setup', (req, res) => {
  try {
    const { apiKey, chatEndpoint, completionEndpoint } = req.body;
    
    // Validate required fields
    if (!apiKey || !chatEndpoint) {
      return res.status(400).json({
        error: 'Missing required fields: apiKey and chatEndpoint are required'
      });
    }
    
    // Validate endpoint URLs
    try {
      new URL(chatEndpoint);
      if (completionEndpoint) new URL(completionEndpoint);
    } catch (error) {
      return res.status(400).json({
        error: 'Invalid endpoint URL format'
      });
    }
    
    // Encrypt the API key
    const encryptedApiKey = encrypt(apiKey);
    
    // Create session
    const sessionId = createSession({
      encryptedApiKey,
      chatEndpoint,
      completionEndpoint: completionEndpoint || null
    });
    
    // Set HTTP-only cookie
    res.cookie('mistral_session', sessionId, {
      httpOnly: true, // Cannot be accessed by JavaScript
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'lax', // CSRF protection
      maxAge: parseInt(process.env.SESSION_MAX_AGE) || 24 * 60 * 60 * 1000, // 24 hours
      path: '/'
    });
    
    console.log('[Setup] New session created successfully');
    
    return res.json({
      success: true,
      message: 'Configuration saved securely'
    });
    
  } catch (error) {
    console.error('[Setup] Error:', error.message);
    return res.status(500).json({
      error: 'Internal server error during setup'
    });
  }
});

/**
 * Chat endpoint - Proxy chat requests to Mistral API
 * POST /api/chat
 * Body: { message, history }
 */
app.post('/api/chat', async (req, res) => {
  try {
    // Get session ID from cookie
    const sessionId = req.cookies.mistral_session;
    
    if (!sessionId) {
      return res.status(401).json({
        error: 'No session found. Please configure your API key first.'
      });
    }
    
    // Retrieve session data
    const session = getSession(sessionId);
    
    if (!session) {
      return res.status(401).json({
        error: 'Session expired or invalid. Please reconfigure your API key.'
      });
    }
    
    // Get request data
    const { message, history } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Invalid request: message is required'
      });
    }
    
    // Decrypt API key
    const apiKey = decrypt(session.encryptedApiKey);
    
    // Build messages array for Mistral API
    const messages = [
      ...(Array.isArray(history) ? history : []),
      { role: 'user', content: message }
    ];
    
    // Call Mistral API
    console.log(`[Chat] Calling Mistral API: ${session.chatEndpoint}`);
    
    const mistralResponse = await fetch(session.chatEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'codestral-latest',
        messages: messages
      })
    });
    
    // Handle Mistral API errors
    if (!mistralResponse.ok) {
      const errorText = await mistralResponse.text();
      console.error(`[Chat] Mistral API error ${mistralResponse.status}:`, errorText);
      
      return res.status(502).json({
        error: `Mistral API error (${mistralResponse.status}): ${mistralResponse.statusText}`
      });
    }
    
    // Parse response
    const data = await mistralResponse.json();
    const reply = data.choices?.[0]?.message?.content || '';
    
    console.log('[Chat] Successfully received response from Mistral');
    
    return res.json({
      reply,
      model: data.model || 'codestral-latest',
      usage: data.usage || null
    });
    
  } catch (error) {
    console.error('[Chat] Error:', error.message);
    return res.status(500).json({
      error: 'Internal server error during chat request'
    });
  }
});

/**
 * Logout endpoint - Delete session and clear cookie
 * POST /api/logout
 */
app.post('/api/logout', (req, res) => {
  try {
    const sessionId = req.cookies.mistral_session;
    
    if (sessionId) {
      deleteSession(sessionId);
    }
    
    // Clear cookie
    res.clearCookie('mistral_session', { path: '/' });
    
    console.log('[Logout] Session cleared');
    
    return res.json({
      success: true,
      message: 'Session cleared successfully'
    });
    
  } catch (error) {
    console.error('[Logout] Error:', error.message);
    return res.status(500).json({
      error: 'Internal server error during logout'
    });
  }
});

// ============================================================================
// Error Handling
// ============================================================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('[Global Error]:', error);
  res.status(500).json({
    error: 'Internal server error'
  });
});

// ============================================================================
// Server Startup
// ============================================================================

app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('Mistral Codestral API Proxy Server');
  console.log('='.repeat(60));
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend URL: ${FRONTEND_URL}`);
  console.log('='.repeat(60));
});