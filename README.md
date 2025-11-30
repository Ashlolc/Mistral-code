# Mistral Codestral Chat 🚀

## 🌐 **[Launch App →](https://ashlolc.github.io/Mistral-code/)**

> **Note:** The app requires a backend server to function. See [Deployment](#deployment) section below.

A secure, open-source web interface for interacting with Mistral's Codestral API. Built with encrypted session storage and cookie-based authentication to keep your API keys safe.

**Created by: Ashlolc, Perplexity, and Mistral**

---

## ✨ Features

- **🔒 Secure by Design**: API keys encrypted server-side, never stored in browser
- **🍪 Cookie-Based Sessions**: HTTP-only cookies prevent JavaScript access
- **🚫 CORS-Free**: Backend proxy eliminates browser CORS restrictions
- **⏱️ Auto-Expiring Sessions**: Sessions auto-delete after 24 hours
- **🧑‍💻 Clean Code**: Well-organized, commented code ready for open source
- **📦 Easy Deploy**: One-click deployment to Railway, Render, or Fly.io

---

## 🏛️ Architecture

### Security Flow

```
👤 User Browser              🖥️ Backend Server           🤖 Mistral API
     |                           |                        |
     | 1. Submit API Key         |                        |
     |-------------------------->|                        |
     |                           | 2. Encrypt key         |
     |                           | 3. Store in memory     |
     |                           | 4. Generate session ID |
     | 5. Set cookie (session ID)|                        |
     |<--------------------------|                        |
     |                           |                        |
     | 6. Send chat message      |                        |
     |    (with cookie)          |                        |
     |-------------------------->| 7. Decrypt key         |
     |                           | 8. Call Mistral API    |
     |                           |----------------------->|
     |                           | 9. Receive response    |
     |                           |<-----------------------|
     | 10. Display response      |                        |
     |<--------------------------|                        |
```

### Why This is Secure

✅ **API key never touches browser** - Only sent once during setup  
✅ **Encrypted storage** - AES-256-CBC encryption on server  
✅ **HTTP-only cookies** - JavaScript can't access session cookie  
✅ **No CORS issues** - Server-to-server calls bypass browser restrictions  
✅ **Auto-cleanup** - Expired sessions automatically deleted  

---

## 📦 Project Structure

```
Mistral-code/
├── index.html              # Frontend HTML
├── css/
│   └── styles.css          # UI styling
├── js/
│   └── script.js           # Frontend logic (calls backend)
├── server/
│   ├── server.js           # Main server file
│   ├── package.json        # Node.js dependencies
│   ├── .env.example        # Environment variables template
│   └── utils/
│       ├── encryption.js   # AES-256 encryption utilities
│       └── sessions.js      # In-memory session management
├── .gitignore
└── README.md
```

---

## 🚀 Deployment

### Prerequisites

1. [Node.js](https://nodejs.org/) 18+ installed
2. A [Mistral API key](https://console.mistral.ai/)
3. (Optional) [Railway](https://railway.app/), [Render](https://render.com/), or [Fly.io](https://fly.io/) account for hosting

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ashlolc/Mistral-code.git
   cd Mistral-code/server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Generate encryption key:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copy the output and paste it into `.env` as `ENCRYPTION_KEY`

5. **Edit `.env` file:**
   ```bash
   PORT=3000
   ENCRYPTION_KEY=your_64_character_hex_string_here
   FRONTEND_URL=http://localhost:8080
   NODE_ENV=development
   ```

6. **Start the server:**
   ```bash
   npm start
   ```

7. **Open the frontend:**
   - Open `index.html` in a browser, or
   - Use a simple HTTP server:
     ```bash
     # In the root directory (not server/)
     python3 -m http.server 8080
     ```
   - Navigate to `http://localhost:8080`

8. **Update frontend config:**
   - Edit `js/script.js`
   - Change `BACKEND_URL` to `http://localhost:3000`

### Production Deployment (Railway)

1. **Push to GitHub** (already done!)

2. **Deploy to Railway:**
   - Go to [Railway.app](https://railway.app/)
   - Click "Start a New Project"
   - Select "Deploy from GitHub repo"
   - Choose `Ashlolc/Mistral-code`
   - Railway will auto-detect Node.js

3. **Set environment variables in Railway:**
   - Go to project settings → Variables
   - Add:
     ```
     ENCRYPTION_KEY=your_64_char_hex_string
     FRONTEND_URL=https://ashlolc.github.io
     NODE_ENV=production
     ```

4. **Configure Railway:**
   - Set Start Command: `cd server && npm start`
   - Set Root Directory: `/`

5. **Get your Railway URL:**
   - Copy the generated URL (e.g., `https://your-app.railway.app`)

6. **Update frontend:**
   - Edit `js/script.js`
   - Change `BACKEND_URL` to your Railway URL
   - Commit and push:
     ```bash
     git add js/script.js
     git commit -m "Update backend URL"
     git push
     ```

7. **Access your app:**
   - Go to https://ashlolc.github.io/Mistral-code/
   - Enter your Mistral API key and start chatting!

### Alternative Hosting (Render / Fly.io)

<details>
<summary>Click to expand Render deployment</summary>

1. Go to [Render.com](https://render.com/)
2. Click "New" → "Web Service"
3. Connect your GitHub repo
4. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add environment variables
6. Deploy!

</details>

<details>
<summary>Click to expand Fly.io deployment</summary>

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. In `server/` directory: `fly launch`
4. Set secrets:
   ```bash
   fly secrets set ENCRYPTION_KEY=your_key
   fly secrets set FRONTEND_URL=https://ashlolc.github.io
   ```
5. Deploy: `fly deploy`

</details>

---

## 🔑 Getting Your Mistral API Key

1. Go to [console.mistral.ai](https://console.mistral.ai/)
2. Sign up or log in
3. Navigate to **API Keys** section
4. Click **Create New Key**
5. Copy the key (starts with `mist_...`)
6. **Important:** Keep this key secret!

### Endpoints

- **Chat Endpoint:** `https://codestral.mistral.ai/v1/chat/completions`
- **Model:** `codestral-latest`

---

## 🐛 Troubleshooting

### "Could not connect to server" error

✅ **Solution:** Make sure backend is running and `BACKEND_URL` in `js/script.js` matches your server URL

### "Session expired" error

✅ **Solution:** Sessions expire after 24 hours. Refresh page and reconfigure.

### CORS errors in console

✅ **Solution:** Make sure `FRONTEND_URL` in backend `.env` matches your frontend domain exactly

### "Invalid encrypted data format" error

✅ **Solution:** Regenerate `ENCRYPTION_KEY` and restart server

---

## 📝 API Reference

### Backend Endpoints

#### `POST /api/setup`
Save encrypted API key and endpoints

**Request:**
```json
{
  "apiKey": "mist_...",
  "chatEndpoint": "https://codestral.mistral.ai/v1/chat/completions",
  "completionEndpoint": "optional"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Configuration saved securely"
}
```

#### `POST /api/chat`
Send chat message to Mistral API

**Request:**
```json
{
  "message": "Write a Python function",
  "history": [] // optional
}
```

**Response:**
```json
{
  "reply": "Here's a Python function...",
  "model": "codestral-latest",
  "usage": { "prompt_tokens": 10, "completion_tokens": 50 }
}
```

#### `POST /api/logout`
Clear session and delete encrypted data

**Response:**
```json
{
  "success": true,
  "message": "Session cleared successfully"
}
```

#### `GET /api/health`
Check server status

**Response:**
```json
{
  "status": "healthy",
  "uptime": 12345,
  "totalSessions": 3
}
```

---

## 🤝 Contributing

Contributions are welcome! This code is clean, organized, and ready for open source collaboration.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is open-source and available under the MIT License.

---

## 🙏 Credits

**This code was made with Ashlolc, Perplexity, and Mistral.**

- **Ashlolc** - Project creator and maintainer
- **Perplexity** - AI assistance and architecture design
- **Mistral** - Codestral API and AI model

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Open an [issue on GitHub](https://github.com/Ashlolc/Mistral-code/issues)
3. Review [Mistral's API documentation](https://docs.mistral.ai/)

---

**Star ⭐ this repo if you found it helpful!**