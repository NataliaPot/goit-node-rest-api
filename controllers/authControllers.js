import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import * as authService from "../services/authServices.js";

import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
const { SECRET_KEY } = process.env;

export const register = async (req, res) => {
  const { email } = req.body;
  const user = await authService.findUser({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const newUser = await authService.signUp(req.body);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
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

  await authService.updateSubscription(_id, { subscription });
  res.status(201).json({
    user: {
      subscription,
    },
  });
};

export const ctrl = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
};
