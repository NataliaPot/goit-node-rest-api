import nodemailer from "nodemailer";
import "dotenv/config.js";

const { UKRNET_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: "nataliapotushynska@ukr.net",
    pass: UKRNET_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: "nataliapotushynska@ukr.net" };
  await transport.sendMail(email);
  return true;
};

export default sendEmail;
