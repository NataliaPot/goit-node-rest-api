import express from "express";
import { ctrl } from "../controllers/authControllers.js";

import validateBody from "../decorators/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

import {
  registerSchema,
  loginSchema,
  updateSubscriptionSchema,
  emailSchema,
} from "../schemas/usersSchemas.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), ctrl.register);

authRouter.get("/verify/:verificationToken", ctrl.verifyEmail);

authRouter.post("/verify", validateBody(emailSchema), ctrl.resendVerifyEmail);

authRouter.post("/login", validateBody(loginSchema), ctrl.login);

authRouter.get("/current", authenticate, ctrl.getCurrent);

authRouter.post("/logout", authenticate, ctrl.logout);

authRouter.patch(
  "/",
  authenticate,
  validateBody(updateSubscriptionSchema),
  ctrl.updateSubscription
);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrl.updateAvatar
);

export default authRouter;
