# Mistral Codestral Backend Server

Secure Node.js backend proxy for Mistral's Codestral API with encrypted session storage.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Generate encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Edit .env and paste the generated key

# Start server
npm start
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|----------|
| `PORT` | Server port | `3000` |
| `ENCRYPTION_KEY` | 64-char hex string for AES-256 | Generate with command above |
| `FRONTEND_URL` | Frontend domain for CORS | `http://localhost:8080` |
| `SESSION_MAX_AGE` | Session expiry in ms | `86400000` (24 hours) |
| `NODE_ENV` | Environment | `development` or `production` |

## Project Structure

```
server/
├── server.js              # Main Express server
├── package.json           # Dependencies
├── .env.example           # Environment template
└── utils/
    ├── encryption.js      # AES-256 encryption
    └── sessions.js         # Session management
```

## How It Works

### 1. Encryption (`utils/encryption.js`)

- Uses AES-256-CBC symmetric encryption
- Each encryption generates a random IV (Initialization Vector)
- Encrypted format: `iv:encryptedData`
- Key must be exactly 32 bytes (64 hex characters)

### 2. Sessions (`utils/sessions.js`)

- In-memory Map storage (sessions cleared on restart)
- Auto-cleanup runs every hour
- Sessions expire after 24 hours of inactivity
- Each session ID is 32 random bytes (64 hex chars)

### 3. API Endpoints (`server.js`)

#### POST `/api/setup`
- Receives: API key + endpoints
- Encrypts API key
- Creates session with random ID
- Sets HTTP-only cookie
- Returns success

#### POST `/api/chat`
- Reads session cookie
- Retrieves encrypted key from session
- Decrypts key
- Calls Mistral API
- Returns response

#### POST `/api/logout`
- Deletes session from memory
- Clears cookie

#### GET `/api/health`
- Returns server status and stats

## Security Features

✅ **Encrypted storage** - API keys encrypted with AES-256  
✅ **HTTP-only cookies** - JavaScript cannot access  
✅ **Secure flag** - HTTPS-only in production  
✅ **SameSite protection** - CSRF mitigation  
✅ **Auto-expiry** - Sessions auto-delete after 24h  
✅ **No logging** - API keys never logged  

## Development

```bash
# Install with dev dependencies
npm install

# Run with auto-reload
npm run dev
```

## Production Deployment

See main [README.md](../README.md) for deployment guides for:
- Railway
- Render
- Fly.io

## Troubleshooting

### "ENCRYPTION_KEY environment variable is not set"
➡️ Add `ENCRYPTION_KEY` to your `.env` file

### "ENCRYPTION_KEY must be 64 hex characters"
➡️ Generate a proper key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### CORS errors
➡️ Make sure `FRONTEND_URL` matches your frontend domain exactly

### Sessions not persisting
➡️ Sessions are stored in-memory and cleared on server restart. This is intentional for security.

## License

MIT