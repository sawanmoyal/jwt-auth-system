# 🚀 Deployment Checklist

## Pre-flight Checks
- [ ] All files committed to GitHub
- [ ] No `.env` files in the repo (only `.env.example`)
- [ ] `node_modules/` not in repo

---

## Step 1 — MongoDB Atlas
- [ ] Account created at https://cloud.mongodb.com
- [ ] Free M0 cluster created (e.g., region: Singapore or US East)
- [ ] Database user created with password
- [ ] Network Access: IP Whitelist set to `0.0.0.0/0`
- [ ] Connection string copied:
  ```
  mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/jwtauth?retryWrites=true&w=majority
  ```

---

## Step 2 — Backend on Render
- [ ] Account at https://render.com
- [ ] New → Web Service → Connect GitHub repo
- [ ] Settings:
  - Root Directory: `backend`
  - Runtime: Node
  - Build Command: `npm install`
  - Start Command: `npm start`
- [ ] Environment Variables set:
  - [ ] `NODE_ENV` = `production`
  - [ ] `PORT` = `5000`
  - [ ] `MONGODB_URI` = (paste Atlas string)
  - [ ] `JWT_ACCESS_SECRET` = (run: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
  - [ ] `JWT_REFRESH_SECRET` = (different value, same command)
  - [ ] `ACCESS_TOKEN_EXPIRY` = `15m`
  - [ ] `REFRESH_TOKEN_EXPIRY` = `7d`
  - [ ] `FRONTEND_URL` = (set AFTER Vercel deploy)
- [ ] Deploy clicked — wait for "Live" status
- [ ] Test: `curl https://your-api.onrender.com/health`
- [ ] Note your backend URL: `https://________________.onrender.com`

---

## Step 3 — Frontend on Vercel
- [ ] Account at https://vercel.com
- [ ] New Project → Import GitHub repo
- [ ] Settings:
  - Root Directory: `frontend`
  - Framework: Vite (auto-detected)
  - Build Command: `npm run build` (auto)
  - Output Dir: `dist` (auto)
- [ ] Environment Variables:
  - [ ] `VITE_API_BASE_URL` = `https://your-api.onrender.com`
- [ ] Deploy clicked
- [ ] Note your frontend URL: `https://________________.vercel.app`

---

## Step 4 — Wire them together
- [ ] Go back to Render → Environment Variables
- [ ] Update `FRONTEND_URL` = `https://your-app.vercel.app`
- [ ] Click "Save Changes" → Render will redeploy automatically

---

## Step 5 — Smoke Test (CRITICAL)
Open your Vercel URL and test each flow:

### User Flow
- [ ] Visit `/` — landing page loads
- [ ] Visit `/register` — create account with role "user"
- [ ] Redirected to `/dashboard` — token countdown visible
- [ ] Visit `/profile` — your name shown
- [ ] Edit name — save works
- [ ] Click Logout — redirected to `/login`

### Admin Flow  
- [ ] Register new account with role "admin"
- [ ] Redirected to dashboard — "Admin" nav item visible
- [ ] Visit `/admin` — stats + user table loads
- [ ] Toggle a user's status — works

### Token Refresh
- [ ] Stay on dashboard for 15 minutes (or temporarily set `ACCESS_TOKEN_EXPIRY=30s`)
- [ ] Make any API call — it should silently refresh and succeed

### Security
- [ ] Try visiting `/dashboard` while logged out → redirected to `/login`
- [ ] Try visiting `/admin` as regular user → redirected to `/dashboard`
- [ ] In Postman: call `/api/admin/stats` with a user token → 403

---

## Common Issues & Fixes

| Problem | Cause | Fix |
|---------|-------|-----|
| CORS error | `FRONTEND_URL` wrong in Render | Check exact Vercel URL, no trailing slash |
| Cookie not sent | Frontend not using `withCredentials: true` | Already set in `src/utils/api.js` |
| "Cannot POST /api/auth/login" | Backend not deployed | Check Render logs |
| Login works but refresh fails | Cookie `sameSite` issue | Both services must be HTTPS in production |
| Render cold start (30s wait) | Free tier sleeps after 15 min | Expected — upgrade to paid or live with it |
| 401 on every request | Access token not in localStorage | Check browser DevTools → Application → Local Storage |

---

## Generate Strong Secrets
```bash
# Run this locally to generate JWT secrets:
node -e "console.log('ACCESS:', require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log('REFRESH:', require('crypto').randomBytes(64).toString('hex'))"
```
