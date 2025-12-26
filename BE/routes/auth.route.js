import { Router } from "express";
import * as AUC from "../controllers/auth.controller.js";
import * as USC from "../validation/authValidation.js";
import validateMiddle from "../middleWares/validationMiddle.js";

const router = Router();

router.post("/register", validateMiddle(USC.registerSchema), AUC.register);
router.post("/login", validateMiddle(USC.loginSchema), AUC.login);
router.get("/activate_account/token=:token", AUC.activate_account); //activation account

export default router;
