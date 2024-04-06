import Joi from "joi";

import { emailRegexp } from "../constants/user-constants.js";

export const registerSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

export const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string(),
});

export const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string().required(),
});
