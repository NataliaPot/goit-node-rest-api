import bcrypt from "bcrypt";

import User from "../models/user.js";

export const signUp = async (data) => {
  const { password } = data;
  const hashPassword = await bcrypt.hash(password, 10);
  return User.create({ ...data, password: hashPassword });
};

export const findUser = (filter) => User.findOne(filter);

export const setUserToken = (filter, data) =>
  User.findOneAndUpdate(filter, data);

export const updateUser = (filter, data) =>
  User.findOneAndUpdate(filter, data);
