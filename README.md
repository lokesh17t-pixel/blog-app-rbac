# Blog Application with Role-Based Access Control (RBAC)

MCA Unit 4 Assignment – Blog Application with **Role-Based Access Control (RBAC)**.

---

## Authentication vs Authorization

| Concept | Meaning |
|---------|---------|
| **Authentication** | Verifying *who* the user is (login / session cookie) |
| **Authorization** | Deciding *what* the authenticated user is allowed to do (roles) |

Flow for every protected request:

```
Request
  ↓
Authentication (authMiddleware)  →  identifies the user via signed cookie
  ↓
Authorization (authorizeRoles / checkBlogOwnership)  →  checks role + ownership
  ↓
Allow / Deny (200 or 403)
```

---

## Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Admin** | Manage all users (list, change role, delete). Create, update & delete **any** blog. Full administrative access. |
| **Author** | Create blogs. Update / delete **only their own** blogs. Add comments & likes. |
| **User** | View blogs. Add comments. Like blogs. **Cannot** create / update / delete blogs. |

Default role on registration: **`user`**.  
Self-registration allows choosing `user` or `author`.  
Admin accounts should be created manually or promoted via the admin API.

---

## Protected APIs

### Blog Routes (`/blogs`)

| Method | Endpoint | Auth | Allowed Roles | Ownership check |
|--------|----------|------|---------------|-----------------|
| GET | `/blogs` | No | Public | – |
| GET | `/blogs/search` | No | Public | – |
| GET | `/blogs/:id` | No | Public | – |
| **POST** | `/blogs` | Yes | admin, author | – |
| **PUT** | `/blogs/:id` | Yes | admin, author | Yes (owner or admin) |
| **PATCH** | `/blogs/:id` | Yes | admin, author | Yes (owner or admin) |
| **DELETE** | `/blogs/:id` | Yes | admin, author | Yes (owner or admin) |
| POST | `/blogs/:id/comment` | Yes | any authenticated | – |
| POST | `/blogs/:id/likes` | Yes | any authenticated | – |

### User / Admin Routes (`/users`)

| Method | Endpoint | Auth | Allowed Roles |
|--------|----------|------|---------------|
| POST | `/users/register` | No | Public |
| POST | `/users/login` | No | Public |
| POST | `/users/logout` | Yes | Any logged-in |
| POST | `/users/logout-all` | Yes | Any logged-in |
| **GET** | `/users` | Yes | **admin** |
| **PATCH** | `/users/:id/role` | Yes | **admin** |
| **DELETE** | `/users/:id` | Yes | **admin** |

---

## How Authorization Works

1. **Authentication middleware** – reads signed `sid` cookie, loads session + user, attaches `req.user`.
2. **`authorizeRoles(...roles)`** – checks `req.user.role` is allowed → **403** if not.
3. **`checkBlogOwnership`** – Admin can manage any blog; Author only their own → **403** otherwise.

---

## Unauthorized Access Responses

| Situation | HTTP Status |
|-----------|-------------|
| Not logged in / session expired | **401** |
| Wrong role or editing another's blog | **403** |
| Resource not found | **404** |

---

## Project Structure

```
blog-app-rbac/
├── app.js
├── package.json
├── .gitignore
├── README.md
├── controllers/
│   └── userController.js
├── db/
│   └── db.js
├── middleware/
│   ├── authMiddleware.js
│   └── rbacMiddleware.js
├── models/
│   ├── User.js
│   ├── Blog.js
│   ├── Session.js
│   └── OTP.js
└── routes/
    ├── blogRoutes.js
    └── userRoutes.js
```

---

## Setup

```bash
git clone https://github.com/lokesh17t-pixel/blog-app-rbac.git
cd blog-app-rbac
npm install
```

Create a `.env` file (never commit it):

```
PORT=8000
SECRET_KEY=your-secret-key
MONGODB_URL=your-mongodb-connection-string
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
SMTP_USER=...
SMTP_PASS=...
```

```bash
npm start
```

---

## Creating an Admin User

Register a user, then promote via MongoDB or (once you have one admin):

```
PATCH /users/<userId>/role
Body: { "role": "admin" }
```

---

## Key Concepts

- Authentication vs Authorization
- RBAC (Role-Based Access Control)
- Roles and permissions matrix
- Authorization middleware
- Resource ownership checks
- Protected routes
- Unauthorized access handling (401 / 403)
