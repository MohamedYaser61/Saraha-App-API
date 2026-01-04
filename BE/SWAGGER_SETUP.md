# Swagger API Documentation Setup - Complete Guide

## Overview
This project now includes comprehensive OpenAPI/Swagger documentation with interactive UI. All endpoints are documented with request/response schemas, authentication requirements, and example values.

## Installation & Setup

### 1. Install Dependencies
```bash
cd /Users/mohamedyaser/Documents/NTI/Backend/lec-6/BE
npm install swagger-jsdoc swagger-ui-express
```

### 2. Verify Installation
The following packages have been added to `package.json`:
- `swagger-jsdoc`: ^6.2.8 (generates OpenAPI spec from JSDoc comments)
- `swagger-ui-express`: ^5.0.0 (serves interactive Swagger UI)

### 3. Project Files Modified/Created

#### New Files:
- **swagger.js** - Swagger configuration and OpenAPI spec definition

#### Updated Files:
- **index.js** - Added Swagger UI middleware
- **routes/auth.route.js** - Added JSDoc Swagger comments
- **routes/user.route.js** - Added JSDoc Swagger comments  
- **routes/message.route.js** - Added JSDoc Swagger comments

## How to Run

### Start the Server
```bash
npm run dev
```

The server will start on the configured PORT (check your .env file, typically 5000 or 3000).

### Access Swagger UI
Open your browser and navigate to:
```
http://localhost:5000/api-docs
```

(Replace `5000` with your actual PORT if different)

## Using Swagger UI

### 1. **Authentication Setup**
- Click the "Authorize" button (top-right with lock icon)
- Paste your JWT token (without "Bearer" prefix)
- Click "Authorize" to apply the token to all subsequent requests
- All protected endpoints will now automatically include your token

### 2. **Making Requests**
- Click on any endpoint to expand it
- Click "Try it out" button
- Fill in required parameters and request body
- Click "Execute" to send the request
- View the response with status code, headers, and body

### 3. **Testing Flow**

#### Test Registration:
1. POST `/auth/register` - Create new account
2. Check email for activation link
3. Click activation link to activate account

#### Test Login:
1. POST `/auth/login` - Authenticate and get JWT token
2. Copy the token from response
3. Click "Authorize" button in Swagger UI
4. Paste token and authorize

#### Test Protected Endpoints:
1. GET `/users/{id}` - Get your profile (requires JWT)
2. PATCH `/users/change-password` - Change password
3. POST `/users/upload` - Upload profile picture

## API Endpoints Summary

### Authentication (Public)
- **POST** `/auth/register` - Register new user
- **POST** `/auth/login` - Login and get JWT token
- **GET** `/auth/activate_account/token={token}` - Activate account

### Users
- **GET** `/users` - Get all users (public)
- **GET** `/users/{id}` - Get user by ID (protected)
- **PATCH** `/users/change-password` - Change password (protected)
- **PATCH** `/users/update/{id}` - Update profile (protected)
- **POST** `/users/upload` - Upload profile image (protected)

### Messages
- **POST** `/messages` - Create message
- **GET** `/messages/allMessages` - Get all messages
- **GET** `/messages/{messageID}` - Get message by ID

## Security

### JWT Bearer Token
The API uses JWT (JSON Web Tokens) for authentication:
- Tokens are obtained from `/auth/login`
- Include token in `Authorization` header as: `Bearer <token>`
- Swagger UI handles this automatically when you click "Authorize"

### Protected Routes
Routes marked with 🔒 require valid JWT token:
- `/users/{id}`
- `/users/change-password`
- `/users/update/{id}`
- `/users/upload`

## Example Usage Scenarios

### Scenario 1: User Registration & Login

1. Register:
```json
POST /auth/register
{
  "userName": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "Phone": "+1234567890"
}
```

Response (201):
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "userName": "john_doe",
    "email": "john@example.com",
    "Phone": "+1c7VxP2...encrypted",
    "createdAt": "2024-01-04T10:30:00.000Z"
  }
}
```

2. Login:
```json
POST /auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

Response (200):
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YTFiMmMzZDRlNWY2ZzdoOGk5ajBrMSIsImlhdCI6MTcwNDM1NTAwMH0.abc123...",
  "user": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "userName": "john_doe",
    "email": "john@example.com"
  }
}
```

### Scenario 2: Protected Endpoint with JWT

Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

GET /users/65a1b2c3d4e5f6g7h8i9j0k1

Response (200):
```json
{
  "message": "User retrieved successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "userName": "john_doe",
    "email": "john@example.com",
    "Phone": "+1234567890",
    "profileImage": "uploads/profile-1704355200000.jpg",
    "createdAt": "2024-01-04T10:30:00.000Z",
    "updatedAt": "2024-01-04T11:00:00.000Z"
  }
}
```

### Scenario 3: Create Message

POST /messages
```json
{
  "content": "Hello, this is my first message!",
  "userId": "65a1b2c3d4e5f6g7h8i9j0k1"
}
```

Response (201):
```json
{
  "message": "Message created successfully",
  "data": {
    "_id": "65b2c3d4e5f6g7h8i9j0k1l2",
    "content": "Hello, this is my first message!",
    "userId": "65a1b2c3d4e5f6g7h8i9j0k1",
    "createdAt": "2024-01-04T11:15:00.000Z",
    "updatedAt": "2024-01-04T11:15:00.000Z"
  }
}
```

## OpenAPI Specification

The complete OpenAPI 3.0.0 specification is available at: `http://localhost:5000/api-docs`

### Specification Details:
- **Title**: Social Media API
- **Version**: 1.0.0
- **OpenAPI Version**: 3.0.0
- **Security Scheme**: HTTP Bearer (JWT)
- **Server**: http://localhost:5000

## Troubleshooting

### Issue: Swagger UI not loading
**Solution**: Verify that:
1. Server is running: `npm run dev`
2. Port in `.env` matches the URL you're visiting
3. Swagger package installation: `npm ls swagger-jsdoc swagger-ui-express`

### Issue: "No operations defined" in Swagger UI
**Solution**: Check that JSDoc comments are properly formatted above route handlers

### Issue: Token not persisting in Swagger UI
**Solution**: 
1. Click "Authorize" button
2. Paste full token (without "Bearer")
3. Ensure "Persist authorization" option is checked

### Issue: Protected endpoints return 401
**Solution**: 
1. Ensure you have logged in and obtained a valid token
2. Authorization header must be included with token
3. Token must not be expired
4. Use "Authorize" button in Swagger UI to apply token

## Customization

### Update Server URL
Edit `swagger.js`:
```javascript
servers: [
  {
    url: 'http://your-actual-server-url:port',
    description: 'Your Server Description'
  }
]
```

### Add More Endpoints
Add JSDoc comments to new routes following this pattern:
```javascript
/**
 * @swagger
 * /path/to/endpoint:
 *   get:
 *     summary: Brief endpoint description
 *     tags:
 *       - TagName
 *     responses:
 *       200:
 *         description: Success message
 */
```

### Modify API Info
Edit the `info` object in `swagger.js`:
```javascript
info: {
  title: 'Your API Title',
  version: '2.0.0',
  description: 'Your API description'
}
```

## Additional Resources

- [OpenAPI 3.0 Specification](https://spec.openapis.org/oas/v3.0.0)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [swagger-jsdoc Documentation](https://github.com/Surnet/swagger-jsdoc)

---

**Setup completed successfully!** Your API is now fully documented with interactive Swagger UI.
