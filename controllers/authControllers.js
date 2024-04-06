import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import path from "path";
import fs from "fs/promises";
import Jimp from "jimp";
import { nanoid } from "nanoid";

import * as authService from "../services/authServices.js";

import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import sendEmail from "../helpers/sendEmail.js";

const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.resolve("public", "avatars");

export const register = async (req, res) => {
  const { email } = req.body;
  const user = await authService.findUser({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await authService.signUp({
    ...req.body,
    avatarURL,
    verificationToken,
  });
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await authService.findUser({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  await authService.updateUser(user._id, {
    verify: true,
    verificationToken: "",
  });

  res.status(200).json({
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await authService.findUser({ email });
  if (!user) {
    throw HttpError(400, "Missing required field email");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(200).json({
    message: "Verification email sent",
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verified");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = { id: user._id };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await authService.setUserToken(user._id, { token });
  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

export const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

export const logout = async (req, res) => {
  const { _id } = req.user;
  await authService.setUserToken({ _id }, { token: null });
  res.status(204).send();
};

export const updateSubscription = async (req, res) => {
  const { _id, subscription } = req.body;

  await authService.updateUser(_id, { subscription });
  res.status(201).json({
    user: {
      subscription,
    },
  });
};

export const updateAvatar = async (req, res) => {
  const { _id } = req.user;

  if (!req.file) {
    return res.status(400).json({ message: "No file for update" });
  }

  const { path: tempUpload, originalname } = req.file;

  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);

  await Jimp.read(tempUpload)
    .then((image) => {
      return image.resize(250, 250).write(tempUpload);
    })
    .catch((err) => console.log(err));

  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  await authService.updateUser(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

export const ctrl = {
  register: ctrlWrapper(register),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
