# Swagger API Quick Start Guide

## 🚀 Quick Setup (2 minutes)

### Step 1: Install Packages
```bash
npm install
```

### Step 2: Start Server
```bash
npm run dev
```

### Step 3: Open Swagger UI
Visit: **http://localhost:5000/api-docs**

---

## 📋 Complete API Endpoints List

### 🔓 Public Endpoints (No Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create new account |
| POST | `/auth/login` | Login and get JWT token |
| GET | `/auth/activate_account/token={token}` | Activate account |
| GET | `/users` | Get all users |
| POST | `/messages` | Create message |
| GET | `/messages/allMessages` | Get all messages |
| GET | `/messages/{messageID}` | Get specific message |

### 🔒 Protected Endpoints (Require JWT Token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/{id}` | Get user profile |
| PATCH | `/users/change-password` | Change password |
| PATCH | `/users/update/{id}` | Update profile |
| POST | `/users/upload` | Upload profile image |

---

## 🔐 Authentication Flow

### 1. Register
```bash
POST /auth/register
Content-Type: application/json

{
  "userName": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "Phone": "+1234567890"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "userName": "john_doe",
    "email": "john@example.com"
  }
}
```

### 2. Activate Account
Check email and click activation link or use:
```bash
GET /auth/activate_account/token=YOUR_TOKEN_HERE
```

### 3. Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "userName": "john_doe",
    "email": "john@example.com"
  }
}
```

### 4. Use Token in Protected Endpoints
```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🧪 Testing in Swagger UI

### Add JWT Token to Swagger UI
1. Click **"Authorize"** button (lock icon, top right)
2. Paste your JWT token (from login response)
3. ✅ Click **"Authorize"** button
4. All protected endpoints now include your token

### Test an Endpoint
1. Find endpoint in list
2. Click to expand
3. Click **"Try it out"**
4. Fill in parameters/body
5. Click **"Execute"**
6. View response below

---

## 📝 Example Test Scenarios

### Scenario 1: Complete User Journey
```
1. POST /auth/register
   → Get userId from response
   
2. GET /auth/activate_account/token=<activation_token>
   → Activate the account
   
3. POST /auth/login
   → Copy JWT token from response
   
4. Click Authorize in Swagger UI
   → Paste token
   
5. GET /users/{id}
   → View your profile (now authenticated)
```

### Scenario 2: Update Profile
```
1. POST /auth/login (already done)
   → Token from previous scenario

2. PATCH /users/update/{id}
   {
     "userName": "john_updated",
     "Phone": "+9876543210"
   }
   → Profile updated
```

### Scenario 3: Change Password
```
1. POST /auth/login (already done)
   → Token from previous scenario

2. PATCH /users/change-password
   {
     "oldPassword": "SecurePass123!",
     "newPassword": "NewPass456!",
     "confirmNewPassword": "NewPass456!"
   }
   → Password changed
```

### Scenario 4: Upload Profile Image
```
1. POST /auth/login (already done)
   → Token from previous scenario

2. POST /users/upload
   → Select file in "Try it out"
   → Execute
   → Image uploaded
```

### Scenario 5: Create and Retrieve Messages
```
1. POST /messages
   {
     "content": "Hello everyone!",
     "userId": "65a1b2c3d4e5f6g7h8i9j0k1"
   }
   → Message created

2. GET /messages/allMessages
   → View all messages

3. GET /messages/{messageID}
   → View specific message
```

---

## 🔍 Response Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| **200** | OK - Request successful | GET /users/{id} ✓ |
| **201** | Created - Resource created | POST /auth/register ✓ |
| **400** | Bad Request - Invalid input | Missing required field |
| **401** | Unauthorized - Auth required | Missing JWT token |
| **404** | Not Found - Resource doesn't exist | Invalid user ID |
| **500** | Server Error | Unexpected error |

---

## 📂 Project Structure After Setup

```
BE/
├── index.js                          (Updated - Swagger UI added)
├── swagger.js                        (NEW - Swagger config)
├── package.json                      (Updated - packages added)
├── SWAGGER_SETUP.md                  (NEW - Full guide)
├── SWAGGER_CODE_REFERENCE.md         (NEW - Code snippets)
├── config/
│   └── db.js
├── controllers/
│   ├── auth.controller.js
│   ├── message.controller.js
│   └── user.controller.js
├── middleWares/
│   ├── auth.middle.js
│   └── validationMiddle.js
├── models/
│   ├── message.model.js
│   └── user.model.js
├── routes/
│   ├── auth.route.js                (Updated - Swagger comments added)
│   ├── message.route.js             (Updated - Swagger comments added)
│   └── user.route.js                (Updated - Swagger comments added)
├── services/
│   └── multerService.js
├── uploads/
├── utils/
│   ├── sendEmail_template.js
│   └── sendingEmail.js
└── validation/
    ├── authValidation.js
    ├── messageValidation.js
    ├── tast.validation.js
    └── userValidation.js
```

---

## 🛠️ Troubleshooting

### Problem: Port already in use
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Or change PORT in .env file
PORT=3001
```

### Problem: Module not found
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Problem: Swagger UI shows "No operations found"
1. Verify route files have JSDoc comments
2. Check swagger.js points to correct route files
3. Restart server after file changes
4. Clear browser cache (Ctrl+F5 or Cmd+Shift+R)

### Problem: Token not working in protected routes
1. Ensure token is copied without "Bearer" prefix
2. Token may be expired - login again
3. Check token in https://jwt.io to verify it's valid

### Problem: CORS errors
- Already configured in index.js
- If still issues, check that origin in CORS settings matches your frontend URL

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **SWAGGER_SETUP.md** | Complete setup guide with examples |
| **SWAGGER_CODE_REFERENCE.md** | All code snippets and implementation details |
| **This file** | Quick reference guide |

---

## 🎯 Key Features Included

✅ OpenAPI 3.0.0 specification  
✅ JWT Bearer token authentication  
✅ 11 fully documented endpoints  
✅ Request/response schemas with examples  
✅ HTTP status codes and error handling  
✅ File upload (multipart/form-data) support  
✅ Protected routes with security definition  
✅ Interactive Swagger UI at /api-docs  
✅ Token persistence in UI  
✅ Organized by tags (Authentication, Users, Messages)  

---

## 🚀 Ready to Test!

1. **Start server**: `npm run dev`
2. **Open browser**: `http://localhost:5000/api-docs`
3. **Register**: POST `/auth/register`
4. **Login**: POST `/auth/login`
5. **Add token**: Click "Authorize" button
6. **Test endpoints**: Click "Try it out" on any endpoint

---

## 📞 Support

For detailed information:
- See **SWAGGER_SETUP.md** for full guide
- See **SWAGGER_CODE_REFERENCE.md** for code details
- Check OpenAPI spec at **http://localhost:5000/api-docs**

**Happy API testing!** 🎉
