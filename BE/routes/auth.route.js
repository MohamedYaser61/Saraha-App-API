import { Router } from "express";
import * as AUC from "../controllers/auth.controller.js";
import * as USC from "../validation/authValidation.js";
import validateMiddle from "../middleWares/validationMiddle.js";

const router = Router();

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
 *                 description: Username for the account
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *                 description: User email address
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SecurePass123!"
 *                 description: Password (must match confirmPassword)
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: "SecurePass123!"
 *                 description: Password confirmation
 *               Phone:
 *                 type: string
 *                 example: "+1234567890"
 *                 description: Optional phone number
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
 *                   example: "User registered successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               emailExists:
 *                 value:
 *                   Error: "Email is already exist , try new one"
 *                   status: 400
 *               passwordMismatch:
 *                 value:
 *                   Error: "Password must match"
 *                   status: 400
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/register", validateMiddle(USC.registerSchema), AUC.register);

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
 *                 description: User email address
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SecurePass123!"
 *                 description: User password
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
 *                   example: "Login successful"
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated requests
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               Error: "Invalid email or password"
 *               status: 401
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/login", validateMiddle(USC.loginSchema), AUC.login);

/**
 * @swagger
 * /auth/activate_account/token={token}:
 *   get:
 *     summary: Activate user account
 *     tags:
 *       - Authentication
 *     description: Activate a user account using the activation token sent via email
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         description: Activation token
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account activated successfully"
 *       400:
 *         description: Bad request - invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/activate_account/token=:token", AUC.activate_account); //activation account

export default router;

