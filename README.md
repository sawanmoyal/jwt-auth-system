# 🔐 Advanced JWT Authentication System

> A production-ready, full-stack authentication system with access/refresh tokens, role-based access control, secure HTTP-only cookies, and complete MERN stack deployment.

---

## 🚀 Live Links

| Service | URL |
|---------|-----|
| 🌐 **Frontend** | `https://your-app.vercel.app` |
| 🔗 **Backend API** | `https://your-api.onrender.com` |
| 📦 **GitHub** | `https://github.com/yourusername/jwt-auth-system` |

---

## ✨ Features

### Core Authentication
- ✅ **User Registration & Login** — Secure account creation with validation
- ✅ **Password Hashing** — bcrypt with 12 salt rounds
- ✅ **JWT Access Tokens** — Short-lived (15min), signed HS256
- ✅ **JWT Refresh Tokens** — Long-lived (7 days), stored in DB
- ✅ **HTTP-only Cookies** — Refresh token immune to XSS attacks
- ✅ **Token Rotation** — New refresh token on every use (prevents reuse)
- ✅ **Refresh Token Reuse Detection** — Flags and invalidates token families
- ✅ **Auto Token Refresh** — Axios interceptor silently re-auths expired sessions

### Authorization
- ✅ **Role-Based Access Control** — `admin` / `user` roles
- ✅ **Protected Routes** — Backend middleware + frontend route guards
- ✅ **Admin Dashboard** — User management, platform stats
- ✅ **Logout / Logout All Devices** — Per-session or full invalidation

### Security
- ✅ **Helmet.js** — 15+ HTTP security headers
- ✅ **Rate Limiting** — 10 auth attempts per 15 min (brute-force protection)
- ✅ **CORS Whitelist** — Only allows your deployed frontend URL
- ✅ **Secure Cookies** — `httpOnly`, `secure: true`, `sameSite: None` in production
- ✅ **Input Validation** — Server-side validation on all endpoints

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router v6, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (cloud) |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **Security** | Helmet.js, express-rate-limit, cookie-parser |
| **Frontend Deploy** | Vercel |
| **Backend Deploy** | Render |
| **DB Hosting** | MongoDB Atlas |

---

## 📁 Project Structure

```
auth-system/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB Atlas connection
│   │   └── jwt.js             # Token generation, cookie config
│   ├── controllers/
│   │   ├── authController.js  # Register, Login, Refresh, Logout
│   │   └── userController.js  # Profile, Admin stats, User management
│   ├── middleware/
│   │   ├── auth.js            # JWT protect + role authorize
│   │   └── errorHandler.js    # Global error handler
│   ├── models/
│   │   └── User.js            # Mongoose schema with bcrypt hooks
│   ├── routes/
│   │   ├── auth.js            # Auth routes + rate limiting
│   │   └── user.js            # Protected user + admin routes
│   └── server.js              # Express app entry point
│
├── frontend/
│   └── src/
│       ├── context/
│       │   └── AuthContext.jsx    # Global auth state (useReducer)
│       ├── components/
│       │   ├── Navbar.jsx         # Responsive navigation
│       │   └── ProtectedRoute.jsx # Route guards (user + admin)
│       ├── pages/
│       │   ├── Home.jsx           # Landing page
│       │   ├── Login.jsx          # Login form
│       │   ├── Register.jsx       # Register form + password strength
│       │   ├── Dashboard.jsx      # Live token info + session stats
│       │   ├── Profile.jsx        # Edit profile + logout all devices
│       │   └── Admin.jsx          # Admin panel + user management
│       ├── utils/
│       │   └── api.js             # Axios instance + auto-refresh interceptor
│       └── App.jsx                # Router
│
├── render.yaml                    # Render deployment config
└── README.md
```

---

## 🔗 API Endpoints

### Authentication (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create new account |
| `POST` | `/api/auth/login` | Login, receive tokens |
| `POST` | `/api/auth/refresh` | Refresh access token via cookie |

### User (Protected — Bearer token required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/logout` | Logout current session |
| `POST` | `/api/auth/logout-all` | Logout all devices |
| `GET` | `/api/user/profile` | Get own profile |
| `PUT` | `/api/user/profile` | Update name |

### Admin (Admin role required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/stats` | Platform statistics |
| `GET` | `/api/admin/users` | List all users |
| `PATCH` | `/api/admin/users/:id/toggle` | Activate/deactivate user |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/jwt-auth-system.git
cd jwt-auth-system
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your MongoDB URI and JWT secrets in .env
npm run dev
```

### 3. Frontend setup
```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_BASE_URL=http://localhost:5000
npm run dev
```

Open `http://localhost:5173`

---

## ☁️ Deployment Guide

### MongoDB Atlas
1. Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create DB user with password
3. Whitelist IP `0.0.0.0/0`
4. Copy connection string

### Backend → Render
1. Push to GitHub
2. New Web Service on [render.com](https://render.com)
3. Root Directory: `backend`
4. Build: `npm install` | Start: `npm start`
5. Add environment variables (see `.env.example`)

### Frontend → Vercel
1. Import repo on [vercel.com](https://vercel.com)
2. Root Directory: `frontend`
3. Add `VITE_API_BASE_URL=https://your-backend.onrender.com`
4. Deploy, then update `FRONTEND_URL` in Render

---

## 🔐 Environment Variables

### Backend
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_ACCESS_SECRET=<64-char random string>
JWT_REFRESH_SECRET=<64-char random string>
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend
```env
VITE_API_BASE_URL=https://your-api.onrender.com
```

---

## 💡 Future Improvements

- [ ] OAuth 2.0 (Google, GitHub) via Passport.js
- [ ] Email verification on registration
- [ ] Two-factor authentication (TOTP)
- [ ] Redis token blacklist for instant revocation
- [ ] Audit log for admin actions
- [ ] Password reset via email
- [ ] Account activity / login history

---

## 🎓 Project Info

Built for **Campus Placement Drive** submission.
Demonstrates: full-stack development, security best practices, cloud deployment, and production-ready architecture.

**Built with ❤️ using Node.js + React + MongoDB Atlas**
