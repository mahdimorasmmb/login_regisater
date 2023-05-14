import { Router } from "express";

const router = Router();

import * as controller from "../controllers/appController";
import Auth, { localVariables } from "../middleware/auth";
import { registerMail } from "../controllers/mailer";

router.route("/register").post(controller.register);
router.route('/registerMail').post(registerMail)
router.route("/authenticate").post(controller.verifyUser,(req, res) => res.end());
router.route("/login").post(controller.verifyUser,controller.login);

router.route("/user/:username").get(controller.getUser);
router.route("/generateOTP").get(localVariables,controller.verifyUser,controller.generateOTP);
router.route("/verifyOTP").get(controller.verifyOTP);
router.route("/createResetSession").get(controller.createResetSession);

router.route("/updateuser").put(Auth,controller.updateUser);
router.route("/resetPassword").put(controller.verifyUser,controller.resetPassword);

export default router;
