/**
 * Mistral Codestral Chat Frontend
 * 
 * This frontend securely communicates with a backend server that handles
 * API key encryption and Mistral API calls. API keys are never stored in
 * the browser - only a secure session cookie is used.
 * 
 * Created by: Ashlolc, Perplexity, and Mistral
 */

// ============================================================================
// Configuration
// ============================================================================

// Backend server URL - update this when deployed
const BACKEND_URL = 'http://localhost:3000'; // Change to your deployed backend URL

// ============================================================================
// DOM Elements
// ============================================================================

const apiForm = document.getElementById('apiForm');
const chatButton = document.getElementById('chatButton');
const chatContainer = document.getElementById('chatContainer');
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// ============================================================================
// Setup & Configuration
// ============================================================================

/**
 * Handle API configuration form submission
 * Sends encrypted credentials to backend server
 */
apiForm.addEventListener('submit', async function(event) {
  event.preventDefault();
  
  // Get form values
  const apiKey = document.getElementById('apiKey').value.trim();
  const chatEndpoint = document.getElementById('chatEndpoint').value.trim();
  const completionEndpoint = document.getElementById('completionEndpoint').value.trim();
  
  // Validate inputs
  if (!apiKey || !chatEndpoint) {
    showError('API Key and Chat Endpoint are required');
    return;
  }
  
  try {
    // Send configuration to backend
    const response = await fetch(`${BACKEND_URL}/api/setup`, {
      method: 'POST',
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        apiKey,
        chatEndpoint,
        completionEndpoint: completionEndpoint || null
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      showError(data.error || 'Failed to save configuration');
      return;
    }
    
    console.log('[Setup] Configuration saved successfully');
    
    // Clear form for security
    apiForm.reset();
    
    // Animate transition to chat
    apiForm.classList.add('fadeOut');
    
    setTimeout(() => {
      apiForm.style.display = 'none';
      chatButton.classList.remove('hidden');
    }, 500);
    
  } catch (error) {
    console.error('[Setup] Error:', error);
    showError('Network error: Could not connect to server. Is the backend running?');
  }
});

/**
 * Handle chat button click
 * Shows the chat interface
 */
chatButton.addEventListener('click', function() {
  chatButton.classList.add('fadeOut');
  
  setTimeout(() => {
    chatButton.style.display = 'none';
    chatContainer.classList.remove('hidden');
  }, 500);
});

// ============================================================================
// Chat Functionality
// ============================================================================

/**
 * Send a message to the backend and display response
 */
async function sendMessage() {
  const message = userInput.value.trim();
  
  if (!message) {
    return;
  }
  
  // Add user message to chat
  addMessage('You', message, 'user');
  userInput.value = '';
  
  // Show loading indicator
  const loadingId = addMessage('Codestral', 'Thinking...', 'assistant', true);
  
  try {
    // Send message to backend
    const response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      credentials: 'include', // Include session cookie
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        history: [] // You can implement history tracking if needed
      })
    });
    
    const data = await response.json();
    
    // Remove loading message
    removeMessage(loadingId);
    
    if (!response.ok) {
      // Handle errors
      if (response.status === 401) {
        addMessage('System', 'Session expired. Please refresh the page and reconfigure your API key.', 'error');
      } else {
        addMessage('Codestral', `Error: ${data.error || 'Unknown error'}`, 'error');
      }
      return;
    }
    
    // Add assistant response
    addMessage('Codestral', data.reply || '[No response]', 'assistant');
    
    console.log('[Chat] Message sent and response received');
    
  } catch (error) {
    // Remove loading message
    removeMessage(loadingId);
    
    console.error('[Chat] Error:', error);
    addMessage('System', 'Network error: Could not connect to server', 'error');
  }
}

/**
 * Add a message to the chat UI
 * @param {string} sender - Name of sender
 * @param {string} text - Message text
 * @param {string} type - Message type ('user', 'assistant', 'error')
 * @param {boolean} isLoading - Whether this is a loading message
 * @returns {string} Message element ID
 */
function addMessage(sender, text, type = 'assistant', isLoading = false) {
  const messageId = `msg-${Date.now()}`;
  const messageElement = document.createElement('p');
  messageElement.id = messageId;
  messageElement.innerHTML = `<strong>${sender}:</strong> ${escapeHtml(text)}`;
  
  // Apply styling based on type
  if (type === 'error') {
    messageElement.style.color = '#ff5252';
  } else if (isLoading) {
    messageElement.style.fontStyle = 'italic';
    messageElement.style.opacity = '0.7';
  }
  
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  return messageId;
}

/**
 * Remove a message from the chat UI
 * @param {string} messageId - ID of message element to remove
 */
function removeMessage(messageId) {
  const element = document.getElementById(messageId);
  if (element) {
    element.remove();
  }
}

/**
 * Show error message to user
 * @param {string} message - Error message
 */
function showError(message) {
  alert(`Error: ${message}`);
  console.error('[Error]', message);
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============================================================================
// Event Listeners
// ============================================================================

// Send message on button click
sendButton.addEventListener('click', sendMessage);

// Send message on Enter key
userInput.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendMessage();
  }
});

// ============================================================================
// Initialization
// ============================================================================

console.log('[Frontend] Mistral Codestral Chat initialized');
console.log(`[Frontend] Backend URL: ${BACKEND_URL}`);

// Check if session exists on page load
(async function checkSession() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`, {
      credentials: 'include'
    });
    
    if (response.ok) {
      console.log('[Frontend] Backend server is reachable');
    }
  } catch (error) {
    console.warn('[Frontend] Could not reach backend server');
  }
})();