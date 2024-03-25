import express from "express";
import { ctrl } from "../controllers/authControllers.js";

import validateBody from "../helpers/validateBody.js";
import authenticate from "../middlewares/authenticate.js";

import {
  registerSchema,
  loginSchema,
  updateSubscriptionSchema,
} from "../schemas/usersSchemas.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), ctrl.register);

authRouter.post("/login", validateBody(loginSchema), ctrl.login);

authRouter.get("/current", authenticate, ctrl.getCurrent);

authRouter.post("/logout", authenticate, ctrl.logout);

authRouter.patch(
  "/",
  authenticate,
  validateBody(updateSubscriptionSchema),
  ctrl.updateSubscription
);

export default authRouter;
