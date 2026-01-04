import { Router } from "express";
import * as MC from "../controllers/message.controller.js";
import * as MV from "../validation/messageValidation.js";
import validation from "../middleWares/validationMiddle.js";

const router = Router();

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Create a new message
 *     tags:
 *       - Messages
 *     description: Create and store a new message
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
 *                 description: Message content
 *               userId:
 *                 type: string
 *                 example: "65a1b2c3d4e5f6g7h8i9j0k1"
 *                 description: ID of the user sending the message
 *     responses:
 *       201:
 *         description: Message created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Message created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Message'
 *       400:
 *         description: Bad request - validation error
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
router.post('/', validation(MV.createMessageSchema), MC.createMessage);

/**
 * @swagger
 * /messages/allMessages:
 *   get:
 *     summary: Get all messages
 *     tags:
 *       - Messages
 *     description: Retrieve all messages with pagination support
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Number of messages per page
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Messages retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *       400:
 *         description: Bad request - validation error
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
router.get('/allMessages/', validation(MV.allMessagesSchema), MC.getAllMessages);

/**
 * @swagger
 * /messages/{messageID}:
 *   get:
 *     summary: Get message by ID
 *     tags:
 *       - Messages
 *     description: Retrieve a specific message by its ID
 *     parameters:
 *       - name: messageID
 *         in: path
 *         required: true
 *         description: Message ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Message retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Message'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Message not found
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
router.get('/:messageID', validation(MV.singleMessageSchema), MC.getMessage);

export default router;
