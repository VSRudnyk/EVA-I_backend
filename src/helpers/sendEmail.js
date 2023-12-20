const sgMail = require('@sendgrid/mail');

const { SENDGRID_API_KEY, SANDGRID_EMAIL } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
  const message = { ...data, from: SANDGRID_EMAIL };

  await sgMail.send(message);
};

module.exports = sendEmail;
