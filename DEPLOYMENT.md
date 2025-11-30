# Deployment Guide

Step-by-step guide to deploy your Mistral Codestral Chat app.

## 📋 Prerequisites Checklist

- [ ] GitHub account with this repo
- [ ] Mistral API key from [console.mistral.ai](https://console.mistral.ai/)
- [ ] Hosting account (Railway, Render, or Fly.io)

## 🚂 Option 1: Railway (Recommended - Easiest)

### Step 1: Deploy Backend

1. **Go to Railway**
   - Visit [railway.app](https://railway.app/)
   - Sign in with GitHub

2. **Create New Project**
   - Click "Start a New Project"
   - Select "Deploy from GitHub repo"
   - Choose `Ashlolc/Mistral-code`

3. **Generate Encryption Key**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copy the output (should be 64 characters)

4. **Add Environment Variables**
   - In Railway dashboard, go to "Variables" tab
   - Click "+ New Variable"
   - Add these:
   
   | Variable | Value |
   |----------|-------|
   | `ENCRYPTION_KEY` | Paste your generated 64-char key |
   | `FRONTEND_URL` | `https://ashlolc.github.io` |
   | `NODE_ENV` | `production` |
   | `PORT` | `3000` |

5. **Deploy**
   - Railway will auto-deploy
   - Wait for build to complete
   - Copy your Railway URL (e.g., `https://mistral-code-production.up.railway.app`)

### Step 2: Update Frontend

1. **Edit `js/script.js`**
   - Find line 10: `const BACKEND_URL = 'http://localhost:3000';`
   - Change to: `const BACKEND_URL = 'https://your-railway-url.railway.app';`
   - Replace with YOUR actual Railway URL

2. **Commit and Push**
   ```bash
   git add js/script.js
   git commit -m "Update backend URL for production"
   git push origin main
   ```

3. **Wait for GitHub Pages**
   - GitHub Pages will auto-rebuild (takes 1-2 minutes)
   - Check deployment status at: `github.com/Ashlolc/Mistral-code/actions`

### Step 3: Test Your App

1. **Open Your App**
   - Go to https://ashlolc.github.io/Mistral-code/

2. **Configure API**
   - Enter your Mistral API key
   - Endpoint: `https://codestral.mistral.ai/v1/chat/completions`
   - Click "Save Securely"

3. **Test Chat**
   - Click "Open Chat"
   - Send a message: "Write a Python hello world"
   - You should get a response!

### Troubleshooting Railway

**Build fails?**
- Check Railway logs for errors
- Make sure `railway.json` exists in root
- Verify `server/package.json` exists

**CORS errors?**
- Make sure `FRONTEND_URL` is exactly `https://ashlolc.github.io` (no trailing slash)
- Redeploy after changing variables

**Can't connect to server?**
- Check Railway service is running (green status)
- Verify `BACKEND_URL` in `js/script.js` matches Railway URL
- Check browser console for errors

---

## 🌐 Option 2: Render

### Step 1: Deploy Backend

1. **Go to Render**
   - Visit [render.com](https://render.com/)
   - Sign in with GitHub

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub: `Ashlolc/Mistral-code`

3. **Configure Service**
   - **Name:** `mistral-code-backend`
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

4. **Add Environment Variables**
   - Click "Advanced" → "Add Environment Variable"
   - Add:
   
   | Key | Value |
   |-----|-------|
   | `ENCRYPTION_KEY` | (generate with node command above) |
   | `FRONTEND_URL` | `https://ashlolc.github.io` |
   | `NODE_ENV` | `production` |

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment
   - Copy your Render URL

### Step 2: Update Frontend

Same as Railway Step 2 above, but use your Render URL.

---

## ✈️ Option 3: Fly.io

### Step 1: Install Fly CLI

```bash
# Mac
brew install flyctl

# Linux/WSL
curl -L https://fly.io/install.sh | sh

# Windows
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

### Step 2: Login and Launch

```bash
# Login to Fly
fly auth login

# Navigate to server directory
cd server

# Launch app
fly launch
```

### Step 3: Configure

When prompted:
- **App name:** `mistral-code-yourname` (must be unique)
- **Region:** Choose closest to you
- **Database:** No
- **Deploy now:** No (we need to set secrets first)

### Step 4: Set Secrets

```bash
# Generate encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Set secrets
fly secrets set ENCRYPTION_KEY=your_64_char_key_here
fly secrets set FRONTEND_URL=https://ashlolc.github.io
fly secrets set NODE_ENV=production
```

### Step 5: Deploy

```bash
fly deploy
```

Your app will be at: `https://mistral-code-yourname.fly.dev`

### Step 6: Update Frontend

Same as Railway Step 2, but use your Fly.io URL.

---

## 📝 Post-Deployment Checklist

- [ ] Backend deployed and running
- [ ] Environment variables set correctly
- [ ] `BACKEND_URL` in `js/script.js` updated
- [ ] Changes committed and pushed to GitHub
- [ ] GitHub Pages rebuilt successfully
- [ ] Tested app with real Mistral API key
- [ ] Chat messages working correctly

---

## 🆘 Updating Your Deployment

### Railway / Render
- Just push to GitHub `main` branch
- Platform auto-deploys changes

### Fly.io
```bash
cd server
fly deploy
```

---

## 📊 Monitoring

### Check Backend Health

Visit: `https://your-backend-url.com/api/health`

Should return:
```json
{
  "status": "healthy",
  "uptime": 12345,
  "totalSessions": 0
}
```

### View Logs

**Railway:** Dashboard → Deployments → View Logs  
**Render:** Dashboard → Logs tab  
**Fly.io:** `fly logs`

---

## ❓ Need Help?

1. Check [Troubleshooting](README.md#troubleshooting) in main README
2. Review deployment platform docs:
   - [Railway Docs](https://docs.railway.app/)
   - [Render Docs](https://render.com/docs)
   - [Fly.io Docs](https://fly.io/docs/)
3. Open an issue on GitHub

---

**Good luck with your deployment! 🚀**