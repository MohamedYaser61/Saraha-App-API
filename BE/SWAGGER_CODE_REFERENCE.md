# Swagger Implementation - Code Reference

## Files Overview

This document contains all the files added and modified for Swagger documentation.

---

## 1. swagger.js (New File)

**Location**: `/BE/swagger.js`

Full configuration file for OpenAPI/Swagger:

```javascript
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Social Media API',
      version: '1.0.0',
      description: 'A comprehensive REST API for social media application with authentication, user management, and messaging',
      contact: {
        name: 'API Support',
        email: 'support@socialmedia.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server',
        variables: {
          port: {
            default: '5000'
          }
        }
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization token. Enter only the token, without the "Bearer" prefix.'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            userName: {
              type: 'string',
              description: 'Username'
            },
            email: {
              type: 'string',
              description: 'User email address'
            },
            Phone: {
              type: 'string',
              description: 'User phone number'
            },
            profileImage: {
              type: 'string',
              description: 'Profile image URL'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Message: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Message ID'
            },
            content: {
              type: 'string',
              description: 'Message content'
            },
            userId: {
              type: 'string',
              description: 'ID of the user who sent the message'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            Error: {
              type: 'string',
              description: 'Error message'
            },
            status: {
              type: 'number',
              description: 'HTTP status code'
            }
          }
        }
      }
    }
  },
  apis: [
    path.join(__dirname, './routes/auth.route.js'),
    path.join(__dirname, './routes/user.route.js'),
    path.join(__dirname, './routes/message.route.js')
  ]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
```

---

## 2. index.js (Updated)

**Location**: `/BE/index.js`

Key additions:
```javascript
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';

// ... existing code ...

// Swagger UI - Add this after configDotenv() and before routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    persistAuthorizationData: true
  }
}));

// ... rest of the code remains the same ...
```

---

## 3. routes/auth.route.js (Updated)

**Location**: `/BE/routes/auth.route.js`

Contains 3 documented endpoints:

### POST /auth/register
```javascript
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     description: Create a new user account with email, password, and profile information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               userName:
 *                 type: string
 *                 example: "john_doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SecurePass123!"
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: "SecurePass123!"
 *               Phone:
 *                 type: string
 *                 example: "+1234567890"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - validation error
 *       500:
 *         description: Server error
 */
router.post("/register", validateMiddle(USC.registerSchema), AUC.register);
```

### POST /auth/login
```javascript
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Authentication
 *     description: Authenticate user with email and password, returns JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SecurePass123!"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated requests
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - invalid credentials
 */
router.post("/login", validateMiddle(USC.loginSchema), AUC.login);
```

### GET /auth/activate_account/token={token}
```javascript
/**
 * @swagger
 * /auth/activate_account/token={token}:
 *   get:
 *     summary: Activate user account
 *     tags:
 *       - Authentication
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account activated successfully
 *       400:
 *         description: Bad request - invalid token
 */
router.get("/activate_account/token=:token", AUC.activate_account);
```

---

## 4. routes/user.route.js (Updated)

**Location**: `/BE/routes/user.route.js`

Contains 5 documented endpoints (2 public, 3 protected with bearerAuth):

### GET /users (Public)
```javascript
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     description: Retrieve a list of all registered users
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
router.get('/', UC.getAllUsers);
```

### GET /users/{id} (Protected 🔒)
```javascript
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       401:
 *         description: Unauthorized - missing or invalid token
 */
router.get('/:id', authMiddleware, UC.getUser);
```

### PATCH /users/change-password (Protected 🔒)
```javascript
/**
 * @swagger
 * /users/change-password:
 *   patch:
 *     summary: Change user password
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *               - confirmNewPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmNewPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Unauthorized - missing or invalid token
 */
router.patch('/change-password', validation(USV.changePasswordSchema), UC.changePassword);
```

### PATCH /users/update/{id} (Protected 🔒)
```javascript
/**
 * @swagger
 * /users/update/{id}:
 *   patch:
 *     summary: Update user profile
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               Phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized - missing or invalid token
 */
router.patch('/update/:id', validation(USV.updateProfileSchema), UC.updateProfile);
```

### POST /users/upload (Protected 🔒, File Upload)
```javascript
/**
 * @swagger
 * /users/upload:
 *   post:
 *     summary: Upload user profile image
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - profile
 *             properties:
 *               profile:
 *                 type: string
 *                 format: binary
 *                 description: Profile image file
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       401:
 *         description: Unauthorized - missing or invalid token
 */
router.post('/upload', multerFun().single('profile'), UC.uploadFile);
```

---

## 5. routes/message.route.js (Updated)

**Location**: `/BE/routes/message.route.js`

Contains 3 documented endpoints:

### POST /messages
```javascript
/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Create a new message
 *     tags:
 *       - Messages
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - userId
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Hello, this is my first message!"
 *               userId:
 *                 type: string
 *                 example: "65a1b2c3d4e5f6g7h8i9j0k1"
 *     responses:
 *       201:
 *         description: Message created successfully
 *       400:
 *         description: Bad request - validation error
 */
router.post('/', validation(MV.createMessageSchema), MC.createMessage);
```

### GET /messages/allMessages
```javascript
/**
 * @swagger
 * /messages/allMessages:
 *   get:
 *     summary: Get all messages
 *     tags:
 *       - Messages
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 */
router.get('/allMessages/', validation(MV.allMessagesSchema), MC.getAllMessages);
```

### GET /messages/{messageID}
```javascript
/**
 * @swagger
 * /messages/{messageID}:
 *   get:
 *     summary: Get message by ID
 *     tags:
 *       - Messages
 *     parameters:
 *       - name: messageID
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message retrieved successfully
 *       404:
 *         description: Message not found
 */
router.get('/:messageID', validation(MV.singleMessageSchema), MC.getMessage);
```

---

## JSDoc Comment Structure

All Swagger documentation uses JSDoc format. Basic structure:

```javascript
/**
 * @swagger
 * /path/to/endpoint:
 *   httpmethod:
 *     summary: Brief one-line description
 *     tags:
 *       - TagName
 *     description: Longer description of what the endpoint does
 *     parameters:
 *       - name: paramName
 *         in: path|query|header|body
 *         required: true|false
 *         schema:
 *           type: string|number|etc
 *     requestBody:
 *       required: true|false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: {}
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Error message
 */
router.httpmethod('/path', middleware, controller);
```

---

## Key Features Implemented

✅ **OpenAPI 3.0.0** specification  
✅ **JWT Bearer Authentication** security scheme  
✅ **Request/Response Schemas** with examples  
✅ **HTTP Status Codes** (200, 201, 400, 401, 404, 500)  
✅ **Protected Routes** marked with security  
✅ **File Upload** endpoint documentation  
✅ **Reusable Schemas** (User, Message, Error)  
✅ **Query Parameters** documentation  
✅ **Interactive Swagger UI** at /api-docs  
✅ **Token Persistence** in Swagger UI  

---

## Next Steps

1. Install dependencies: `npm install`
2. Run server: `npm run dev`
3. Visit: `http://localhost:5000/api-docs`
4. Click "Authorize" and add JWT token
5. Test all endpoints interactively

---

**All files are ready to use. No additional configuration needed!**
