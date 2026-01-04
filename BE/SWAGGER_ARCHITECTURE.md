# Swagger Architecture & Implementation Summary

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Client (Browser)                             │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │         Swagger UI (Interactive Documentation)             │  │
│  │              http://localhost:5000/api-docs               │  │
│  │                                                             │  │
│  │  • Try endpoints interactively                             │  │
│  │  • Authorize with JWT token                               │  │
│  │  • View request/response examples                          │  │
│  │  • Persistent token storage                               │  │
│  └────────────────────────────────────────────────────────────┘  │
└────────────────────┬──────────────────────────────────────────────┘
                     │ HTTP Requests
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Express Server (index.js)                     │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  swagger-ui-express middleware                             │  │
│  │  Serves Swagger UI at /api-docs                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  Routes with JSDoc Comments:                                    │
│  ├─ /auth (auth.route.js)          ┐                           │
│  │  └─ Authentication endpoints     │ JSDoc comments            │
│  │                                  │ parsed by swagger-jsdoc   │
│  ├─ /users (user.route.js)          │                           │
│  │  └─ User management endpoints    │                           │
│  │                                  │                           │
│  └─ /messages (message.route.js)    ┘                           │
│     └─ Message endpoints                                        │
│                                                                   │
└────────────────────┬──────────────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │   swagger.js Config File   │
        │                            │
        │  ┌──────────────────────┐  │
        │  │ Scans JSDoc comments │  │
        │  │ from route files     │  │
        │  └──────────────────────┘  │
        │                            │
        │  ┌──────────────────────┐  │
        │  │ Generates OpenAPI    │  │
        │  │ 3.0 Specification    │  │
        │  └──────────────────────┘  │
        │                            │
        │  ┌──────────────────────┐  │
        │  │ Returns to Swagger   │  │
        │  │ UI for rendering     │  │
        │  └──────────────────────┘  │
        └────────────────────────────┘
```

---

## 🔄 Data Flow Diagram

```
┌──────────────────┐
│   User Opens     │
│  /api-docs URL   │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  index.js serves Swagger UI          │
│  (swagger-ui-express)                │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Swagger UI requests OpenAPI spec    │
│  from /swagger.js configuration      │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  swagger-jsdoc scans:                │
│  • routes/auth.route.js              │
│  • routes/user.route.js              │
│  • routes/message.route.js           │
│                                      │
│  Extracts JSDoc @swagger comments    │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Generates OpenAPI 3.0.0 spec with:  │
│  • Endpoints                         │
│  • Request/Response schemas          │
│  • Security schemes                  │
│  • Examples                          │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Swagger UI renders interactive      │
│  API documentation with:             │
│  • Endpoint list                     │
│  • Try it out buttons                │
│  • Authorize section                 │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  User clicks "Try it out"            │
│  • Fills in parameters               │
│  • Sends HTTP request                │
│  • Shows response                    │
└──────────────────────────────────────┘
```

---

## 📦 Dependencies Added

```json
{
  "swagger-jsdoc": "^6.2.8",        // Parses JSDoc → OpenAPI spec
  "swagger-ui-express": "^5.0.0"    // Serves interactive UI
}
```

| Package | Purpose | Size |
|---------|---------|------|
| **swagger-jsdoc** | Scans JSDoc comments and generates OpenAPI 3.0 spec | ~100KB |
| **swagger-ui-express** | Express middleware that serves Swagger UI | ~50KB |

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────┐
│            JWT Authentication Flow          │
└─────────────────────────────────────────────┘

1. USER REGISTRATION
   POST /auth/register
   Request: { userName, email, password, ... }
   Response: { user, activation_email_sent }
        │
        ├─→ Sends activation email with token
        │
        ▼

2. ACCOUNT ACTIVATION  
   GET /auth/activate_account/token=<TOKEN>
   Response: { message: "Account activated" }
        │
        ▼

3. LOGIN
   POST /auth/login
   Request: { email, password }
   Response: { token: "eyJh...", user }
        │
        ├─→ Token = JWT signed with JWT_SECRET
        │
        ▼

4. AUTHORIZATION (Swagger UI)
   Click "Authorize" button
   Paste JWT token (without "Bearer")
   ✅ Token persisted in browser storage
        │
        ▼

5. PROTECTED REQUEST
   GET /users/:id
   Headers: { Authorization: "Bearer eyJh..." }
        │
        ├─→ Middleware verifies token
        ├─→ Checks JWT_SECRET
        ├─→ Extracts user ID from token
        │
        ▼
   Response: { user_data }

┌─────────────────────────────────────────────┐
│    Security Scheme in Swagger (OpenAPI)     │
├─────────────────────────────────────────────┤
│ bearerAuth:                                  │
│   type: http                                │
│   scheme: bearer                            │
│   bearerFormat: JWT                         │
│                                             │
│ Protected endpoints include:                │
│ security:                                   │
│   - bearerAuth: []                          │
└─────────────────────────────────────────────┘
```

---

## 🎯 File Relationship Diagram

```
swagger.js (Config)
    │
    ├─→ Reads from:
    │   • package.json (API version, name)
    │   • Environment (server URL, port)
    │
    └─→ Scans JSDoc comments from:
        │
        ├─ routes/auth.route.js
        │  ├─ @swagger /auth/register
        │  ├─ @swagger /auth/login
        │  └─ @swagger /auth/activate_account
        │
        ├─ routes/user.route.js
        │  ├─ @swagger /users
        │  ├─ @swagger /users/{id}
        │  ├─ @swagger /users/change-password
        │  ├─ @swagger /users/update/{id}
        │  └─ @swagger /users/upload
        │
        └─ routes/message.route.js
           ├─ @swagger /messages
           ├─ @swagger /messages/allMessages
           └─ @swagger /messages/{messageID}
                │
                └─→ All JSDoc aggregated into
                    OpenAPI 3.0.0 specification
                        │
                        ▼
                    index.js
                    (Express App)
                        │
                        ├─→ swagger-ui-express
                        │   Serves UI at /api-docs
                        │
                        └─→ Client receives
                            interactive documentation
```

---

## 📋 Endpoint Tags Organization

```
OpenAPI Specification
│
├─── Authentication (3 endpoints)
│    ├─ POST /auth/register          [Public]
│    ├─ POST /auth/login              [Public]
│    └─ GET /auth/activate_account    [Public]
│
├─── Users (5 endpoints)
│    ├─ GET /users                    [Public]
│    ├─ GET /users/{id}               [Protected 🔒]
│    ├─ PATCH /users/change-password  [Protected 🔒]
│    ├─ PATCH /users/update/{id}      [Protected 🔒]
│    └─ POST /users/upload            [Protected 🔒]
│
└─── Messages (3 endpoints)
     ├─ POST /messages                [Public]
     ├─ GET /messages/allMessages     [Public]
     └─ GET /messages/{messageID}     [Public]

Total: 11 Documented Endpoints
Protected: 4 endpoints (require JWT token)
Public: 7 endpoints
```

---

## 🔍 JSDoc to OpenAPI Conversion

```
JSDoc Comment Block
┌─────────────────────────────────┐
│ /**                             │
│  * @swagger                     │
│  * /path/to/endpoint:           │
│  *   post:                      │
│  *     summary: Description     │
│  *     requestBody:             │
│  *       required: true         │
│  *       content:               │
│  *         application/json:    │
│  *           schema: { ... }    │
│  *     responses:               │
│  *       200:                   │
│  *         description: Success │
│  */                             │
└─────────────────────────────────┘
           │
           │ swagger-jsdoc parses
           ▼
OpenAPI 3.0.0 JSON
┌─────────────────────────────────┐
│ {                               │
│   "paths": {                    │
│     "/path/to/endpoint": {      │
│       "post": {                 │
│         "summary": "...",       │
│         "requestBody": {...},   │
│         "responses": {...}      │
│       }                         │
│     }                           │
│   }                             │
│ }                               │
└─────────────────────────────────┘
           │
           │ swagger-ui-express renders
           ▼
    Interactive Swagger UI
     in Browser at /api-docs
```

---

## 📊 Request/Response Schema Structure

```
Authorization Flow:
┌──────────────────────────────────────────┐
│  Login Request                           │
├──────────────────────────────────────────┤
│ POST /auth/login                         │
│ Content-Type: application/json           │
│                                          │
│ {                                        │
│   "email": "user@example.com",           │
│   "password": "SecurePass123!"           │
│ }                                        │
└──────────────────────────────────────────┘
                 │
                 │ 200 OK
                 ▼
┌──────────────────────────────────────────┐
│  Login Response                          │
├──────────────────────────────────────────┤
│ {                                        │
│   "message": "Login successful",         │
│   "token": "eyJhbGciOiJIUzI1...",       │
│   "user": {                              │
│     "_id": "65a1b2c3d4e5...",           │
│     "userName": "user",                  │
│     "email": "user@example.com"          │
│   }                                      │
│ }                                        │
└──────────────────────────────────────────┘
         │
         │ Copy token
         ▼
  Swagger UI Authorization
┌──────────────────────────────────────────┐
│  Click "Authorize" → Paste Token         │
│  (without "Bearer" prefix)               │
│                                          │
│  Token persisted in localStorage:        │
│  {                                       │
│    "bearer_token": "eyJhbGciOiJIUzI1..." │
│  }                                       │
└──────────────────────────────────────────┘
         │
         │ Auto-applied to all requests
         ▼
┌──────────────────────────────────────────┐
│  Protected Endpoint Request              │
├──────────────────────────────────────────┤
│ GET /users/65a1b2c3d4e5...               │
│ Authorization: Bearer eyJhbGciOiJIUzI1...│
│                (auto-added by Swagger)   │
└──────────────────────────────────────────┘
         │
         │ 200 OK
         ▼
┌──────────────────────────────────────────┐
│  Protected Endpoint Response             │
├──────────────────────────────────────────┤
│ {                                        │
│   "message": "User retrieved successfully"
│   "data": {                              │
│     "_id": "65a1b2c3d4e5...",           │
│     "userName": "user",                  │
│     "email": "user@example.com",         │
│     "Phone": "encrypted_value",          │
│     "profileImage": "path/to/image.jpg", │
│     "createdAt": "2024-01-04T10:30:00Z", │
│     "updatedAt": "2024-01-04T11:00:00Z"  │
│   }                                      │
│ }                                        │
└──────────────────────────────────────────┘
```

---

## ✅ Implementation Checklist

- [x] Install swagger-jsdoc and swagger-ui-express packages
- [x] Create swagger.js configuration file with OpenAPI 3.0.0
- [x] Add Swagger UI middleware to index.js
- [x] Add bearerAuth security scheme to swagger.js
- [x] Document all auth endpoints with JSDoc comments
- [x] Document all user endpoints with JSDoc comments
- [x] Document all message endpoints with JSDoc comments
- [x] Include request/response schemas and examples
- [x] Mark protected endpoints with security: bearerAuth
- [x] Add HTTP status codes (200, 201, 400, 401, 404, 500)
- [x] Create reusable schemas (User, Message, Error)
- [x] Enable token persistence in Swagger UI
- [x] Create comprehensive documentation files
- [x] Provide examples and usage scenarios

---

## 🚀 Launch Checklist

- [ ] Run: `npm install`
- [ ] Run: `npm run dev`
- [ ] Visit: `http://localhost:5000/api-docs`
- [ ] Test: POST /auth/register
- [ ] Test: POST /auth/login
- [ ] Copy JWT token from login response
- [ ] Click Authorize in Swagger UI
- [ ] Paste JWT token
- [ ] Test: GET /users/{id} (protected endpoint)
- [ ] View response with user data
- [ ] ✅ Swagger setup complete!

---

## 📚 Documentation Files Created

| File | Purpose | Link |
|------|---------|------|
| **swagger.js** | OpenAPI 3.0 configuration | `/BE/swagger.js` |
| **SWAGGER_SETUP.md** | Complete setup & usage guide | `/BE/SWAGGER_SETUP.md` |
| **SWAGGER_CODE_REFERENCE.md** | Full code snippets | `/BE/SWAGGER_CODE_REFERENCE.md` |
| **SWAGGER_QUICK_START.md** | Quick reference guide | `/BE/SWAGGER_QUICK_START.md` |
| **SWAGGER_ARCHITECTURE.md** | This file - diagrams & flow | `/BE/SWAGGER_ARCHITECTURE.md` |

---

## 🎓 Learning Path

1. **Understand Structure**
   - Read SWAGGER_QUICK_START.md
   
2. **Setup & Install**
   - Run: `npm install`
   - Start: `npm run dev`

3. **Test in UI**
   - Open: http://localhost:5000/api-docs
   - Register → Login → Test endpoints

4. **Review Implementation**
   - Check swagger.js
   - Review JSDoc comments in routes
   - Study SWAGGER_CODE_REFERENCE.md

5. **Add Your Endpoints**
   - Follow JSDoc patterns
   - Add to new routes
   - Restart server to regenerate spec

---

**Your API is now fully documented with interactive Swagger UI! 🎉**
