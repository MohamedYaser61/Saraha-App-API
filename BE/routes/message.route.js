import { Router } from "express";
import * as MC from "../controllers/message.controller.js";
import * as MV from "../validation/messageValidation.js";
import validation from "../middleWares/validationMiddle.js";

const router = Router();
router.post('/', validation(MV.createMessageSchema), MC.createMessage);
router.get('/allMessages/', validation(MV.allMessagesSchema), MC.getAllMessages);
router.get('/:messageID', validation(MV.singleMessageSchema), MC.getMessage);
// router.delete('/:messageID', validation(MV.singleMessageSchema), MC.deleteMessage);

export default router;