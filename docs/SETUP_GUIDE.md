# Mobizilla Nepal — Complete Setup Guide

This guide covers **local development**, **deployment**, and **Git usage** for the Mobizilla Nepal project (Repair, Buyback, Academy & Store).

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Setup](#local-setup)
3. [Environment Variables](#environment-variables)
4. [Running Locally](#running-locally)
5. [Project Structure](#project-structure)
6. [Deployment (Netlify)](#deployment-netlify)
7. [Git Workflow](#git-workflow)

---

## Prerequisites

Install these before starting:

| Tool | Purpose | Install |
|------|---------|---------|
| **Node.js** | JavaScript runtime (v18+) | [nodejs.org](https://nodejs.org) |
| **npm** | Package manager (comes with Node) | — |
| **Git** | Version control | [git-scm.com](https://git-scm.com) |

Check versions:

```powershell
node -v   # Should be v18 or higher
npm -v
git -v
```

---

## Local Setup

### 1. Clone the repository (if not already)

```powershell
cd c:\Users\mobiz\mymobizilla
git clone <your-repo-url> snaptechfix-main
cd snaptechfix-main
```

### 2. Install dependencies

```powershell
npm install
```

### 3. Create environment file

```powershell
copy .env.example .env
```

Then edit `.env` with your values (see [Environment Variables](#environment-variables)).

---

## Environment Variables

Create a `.env` file in the project root. Copy from `.env.example`:

```powershell
copy .env.example .env
```

### Required for core features

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGciOiJIUzI1NiIs...` |

### Optional (for full functionality)

| Variable | Description |
|----------|-------------|
| `SMTP_HOST` | SMTP server (e.g. `smtp.zoho.in`) |
| `SMTP_PORT` | Usually `587` |
| `SMTP_USER` | Email address for sending |
| `SMTP_PASS` | Email password |
| `ADMIN_EMAIL` | Admin notification email |
| `FROM_EMAIL` | From address for emails |
| `VITE_EMAIL_SERVER_URL` | Override email server URL (default: `http://localhost:5003`) |

### Minimal `.env` for local dev

```env
# Supabase (required for repairs, devices, etc.)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# App config
VITE_APP_NAME="Mobizilla Nepal"
VITE_APP_URL="http://localhost:5173"
VITE_CURRENCY_CODE="NPR"
VITE_CURRENCY_SYMBOL="₨"
VITE_PHONE_PREFIX="+977"

# Development
NODE_ENV=development
```

**Get Supabase keys:** [supabase.com](https://supabase.com) → Your project → Settings → API.

---

## Running Locally

### Quick start (frontend + email server)

```powershell
npm run dev
```

This starts:

- **Vite dev server** on `http://localhost:5173` (React app)
- **Email server** on `http://localhost:5003` (for repair/contact emails)

### Individual commands

```powershell
# Frontend only (Vite)
npm run dev:frontend

# Email server only
npm run dev:email

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Ports used

| Service | Port | URL |
|---------|------|-----|
| Vite (React) | 5173 | http://localhost:5173 |
| Email server | 5003 | http://localhost:5003 |

---

## Project Structure

```
snaptechfix-main/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── pages/              # Route pages
│   ├── api/                # API clients (Supabase, etc.)
│   ├── services/           # Business logic
│   └── lib/                # Utilities
├── netlify/
│   └── functions/          # Serverless functions (send-email, etc.)
├── backend/                # Laravel backend (optional)
├── public/                 # Static assets
├── .env.example            # Environment template
├── netlify.toml            # Netlify config
├── vite.config.ts          # Vite config
└── package.json
```

---

## Deployment (Netlify)

### Option A: Deploy via Netlify UI

1. Push your code to GitHub.
2. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import an existing project**.
3. Connect your GitHub repo.
4. Netlify will use `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`
5. Add environment variables in **Site settings** → **Environment variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` (for email)
   - `ADMIN_EMAIL`, `FROM_EMAIL`
6. Deploy.

### Option B: Netlify CLI

```powershell
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize (first time)
netlify init

# Deploy
netlify deploy --prod
```

### Environment variables on Netlify

In **Site settings** → **Environment variables**, add:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- `ADMIN_EMAIL`, `FROM_EMAIL`

---

## Git Workflow

### Initial setup

```powershell
# Configure Git (one-time)
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

### Daily workflow

```powershell
# 1. Create/switch branch
git checkout -b feature/my-feature    # New branch
# or
git checkout main                     # Switch to main

# 2. Check status
git status

# 3. Stage changes
git add .                             # All files
git add src/pages/Contact.tsx         # Specific file

# 4. Commit
git commit -m "Add contact form validation"

# 5. Push to remote
git push origin feature/my-feature
```

### Common commands

| Command | Purpose |
|---------|---------|
| `git status` | See changed files |
| `git diff` | See line-by-line changes |
| `git log --oneline` | Short commit history |
| `git pull origin main` | Get latest from remote |
| `git branch -a` | List branches |

### Branch strategy

```
main          → Production
develop       → Integration (optional)
feature/xxx   → New features
fix/xxx       → Bug fixes
```

### Before pushing

```powershell
# Run linter
npm run lint

# Build (ensure it works)
npm run build
```

---

## Troubleshooting

### Port already in use

```powershell
# Find process on port 5173 (Windows)
netstat -ano | findstr :5173

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Supabase connection issues

- Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Ensure Supabase project is running and RLS policies allow access.

### Emails not sending locally

- Start the email server: `npm run dev:email` or `npm run dev`.
- Configure `SMTP_*` in `.env`.
- For testing, you can use [Mailtrap](https://mailtrap.io) or similar.

### Build fails

```powershell
# Clean and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npm run build
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Install | `npm install` |
| Run dev | `npm run dev` |
| Build | `npm run build` |
| Lint | `npm run lint` |
| Preview build | `npm run preview` |

---

## Next Steps

1. Set up Supabase and add keys to `.env`.
2. Run `npm run dev` and open http://localhost:5173.
3. Test repair flow, contact form, and email.
4. Deploy to Netlify when ready.
5. Use Git branches for new features and fixes.
