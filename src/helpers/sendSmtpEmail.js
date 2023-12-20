const nodemailer = require('nodemailer');
const { NODEMAILER_PASSWORD, NODEMAILER_EMAIL } = process.env;

const nodemailConfig = {
  host: 'smtp.ukr.net',
  port: 465,
  secure: true,
  auth: {
    user: NODEMAILER_EMAIL,
    pass: NODEMAILER_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(nodemailConfig);
const sendSmtpEmail = async (data) => {
  const email = { ...data, from: NODEMAILER_EMAIL };
  await transporter.sendMail(email);
};

module.exports = { sendSmtpEmail };
