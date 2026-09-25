# Blog Application with Role-Based Access Control (RBAC)

MCA Unit 4 Assignment – Blog Application with **Role-Based Access Control (RBAC)**.

---

## Authentication vs Authorization

| Concept | Meaning |
|---------|---------|
| **Authentication** | Verifying *who* the user is (login / session cookie) |
| **Authorization** | Deciding *what* the authenticated user is allowed to do (roles) |

```
Request → Authentication → Authorization (role + ownership) → Allow / Deny
```

---

## Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Admin** | Manage all users. Create, update & delete **any** blog. Full access. |
| **Author** | Create blogs. Update/delete **only their own** blogs. Comments & likes. |
| **User** | View blogs. Add comments. Like blogs. Cannot create/update/delete blogs. |

Default role on register: **`user`**. Self-registration allows `user` or `author`.

---

## Protected APIs

### Blog Routes (`/blogs`)

| Method | Endpoint | Auth | Roles | Ownership |
|--------|----------|------|-------|-----------|
| GET | `/blogs` | No | Public | – |
| GET | `/blogs/search` | No | Public | – |
| GET | `/blogs/:id` | No | Public | – |
| **POST** | `/blogs` | Yes | admin, author | – |
| **PUT/PATCH** | `/blogs/:id` | Yes | admin, author | Yes |
| **DELETE** | `/blogs/:id` | Yes | admin, author | Yes |
| POST | `/blogs/:id/comment` | Yes | any logged-in | – |
| POST | `/blogs/:id/likes` | Yes | any logged-in | – |

### User Routes (`/users`)

| Method | Endpoint | Auth | Roles |
|--------|----------|------|-------|
| POST | `/users/register` | No | Public |
| POST | `/users/login` | No | Public |
| POST | `/users/logout` | Yes | Any |
| **GET** | `/users` | Yes | **admin** |
| **PATCH** | `/users/:id/role` | Yes | **admin** |
| **DELETE** | `/users/:id` | Yes | **admin** |

---

## Unauthorized Access

| Situation | Status |
|-----------|--------|
| Not logged in / session expired | **401** |
| Wrong role / editing another's blog | **403** |
| Not found | **404** |

---

## Setup

```bash
cd "Assignment/Unit 4/blog-app"
npm install
```

Create `.env` (do not commit):

```
PORT=8000
SECRET_KEY=your-secret-key
MONGODB_URL=your-mongodb-uri
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

## Key Concepts

- Authentication vs Authorization
- RBAC (roles & permissions)
- Authorization middleware
- Resource ownership
- Protected routes
- 401 / 403 handling
