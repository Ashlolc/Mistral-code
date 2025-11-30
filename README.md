# Mistral API Configurator 🚀

## 🌐 **[Launch App →](https://ashlolc.github.io/Mistral-code/)**

A web-based interface for interacting with Mistral's Codestral API. Configure your API credentials and chat with Codestral directly in your browser.

## Features ✨

- **Codestral Integration**: Chat with Mistral's Codestral model for code assistance
- **Secure Storage**: API key stored only in browser session storage (never sent to external servers)
- **Interactive Chat UI**: Clean, responsive chat interface with real-time responses
- **Material Design**: Modern UI with smooth animations and transitions
- **Mobile Friendly**: Works on both desktop and mobile devices

## How to Use 📝

1. **Get your Mistral API key** from [console.mistral.ai](https://console.mistral.ai/)
2. Open `index.html` in your web browser
3. Enter your credentials:
   - **API Key**: Your Mistral API key
   - **Chat Endpoint**: `https://api.mistral.ai/v1/chat/completions`
   - **Completion Endpoint**: (optional, for future features)
4. Click **Save** to store your configuration
5. Click **Open Chat** to start chatting with Codestral
6. Type your messages and get AI-powered responses!

## API Setup 🔑

### Getting Your Mistral API Key:
1. Go to [console.mistral.ai](https://console.mistral.ai/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste into this app

### Endpoints:
- **Chat Endpoint**: `https://api.mistral.ai/v1/chat/completions`
- Model used: `codestral-latest`

## Folder Structure 📁

```
Mistral-code/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Material Design styling
├── js/
│   └── script.js       # API integration & chat logic
└── README.md           # This file
```

## Technical Details 🔧

- **No Backend Required**: Runs entirely in the browser
- **Session Storage**: Credentials cleared when browser closes
- **Fetch API**: Direct communication with Mistral API
- **Error Handling**: Console logging and user-friendly error messages

## Troubleshooting 🐛

If you're getting errors:

1. **Check API Key**: Make sure it's valid and has credits
2. **Check Endpoint**: Should be `https://api.mistral.ai/v1/chat/completions`
3. **Open DevTools** (F12) and check Console for error messages
4. **CORS Issues**: If running from `file://`, use a local web server instead

## Contributing 🤝

Feel free to fork this repository and make your own changes! Pull requests are welcome.

## License 📜

This project is open-source and available under the MIT License.