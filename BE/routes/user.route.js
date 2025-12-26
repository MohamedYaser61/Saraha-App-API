import { Router } from "express";
import * as UC from "../controllers/user.controller.js";
import authMiddleware from "../middleWares/auth.middle.js";
import * as USV from "../validation/userValidation.js";
import validation from "../middleWares/validationMiddle.js";
import { multerFun } from "../services/multerService.js";



const router = Router();

router.get('/', UC.getAllUsers);
router.get('/:id', authMiddleware, UC.getUser);
router.patch('/change-password', validation(USV.changePasswordSchema), UC.changePassword);

router.patch('/update/:id', validation(USV.updateProfileSchema), UC.updateProfile);

router.post('/upload', multerFun().single('profile'), UC.uploadFile);


export default router;