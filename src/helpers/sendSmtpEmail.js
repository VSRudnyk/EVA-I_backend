const nodemailer = require('nodemailer');
const { NODEMAILER_PASSWORD, NODEMAILER_EMAIL } = process.env;

const nodemailConfig = {
  host: 'smtp.ukr.net',
  port: 465,
  secure: true,
  logger: true,
  debug: true,
  secureConnection: false,
  auth: {
    user: NODEMAILER_EMAIL,
    pass: NODEMAILER_PASSWORD,
  },
  rejectUnAuthrized: true,
};

const transporter = nodemailer.createTransport(nodemailConfig);
const sendSmtpEmail = async (data) => {
  const email = { ...data, from: NODEMAILER_EMAIL };
  try {
    await transporter.sendMail(email);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendSmtpEmail };
