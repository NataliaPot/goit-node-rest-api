import Joi from "joi";
import { emailRegexp } from "../models/user.js";

export const registerSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string(),
});

export const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string().required(),
});
