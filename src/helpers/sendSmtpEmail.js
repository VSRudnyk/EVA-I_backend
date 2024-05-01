const nodemailer = require('nodemailer');
const { NODEMAILER_PASSWORD, NODEMAILER_EMAIL, FRONT_URL, FRONT_LOCAL_URL } =
  process.env;

const nodemailConfig = {
  host: 'smtp.ukr.net',
  port: 465,
  secure: true,
  // logger: true,
  // debug: true,
  secureConnection: false,
  auth: {
    user: NODEMAILER_EMAIL,
    pass: NODEMAILER_PASSWORD,
  },
  rejectUnAuthrized: true,
};

const transporter = nodemailer.createTransport(nodemailConfig);
const sendSmtpEmail = async (email, token, userId, path) => {
  const fogotPasswordMessage = {
    email,
    subject: 'Request to reset your EVA-I password',
    text: 'Click on the link in this email to enter a new password',
    link: `${FRONT_LOCAL_URL}/reset-password?token=${token}`,
    textLink: 'Reset your password',
    salutationText:
      'Hi, we’ve received a request to reset your EVA-I password.',
    actionText:
      'If you didn’t make the request, just ignore this message. Otherwise, please click on the link below to enter a new password:',
  };

  const verifyAccountMessage = {
    email,
    subject: 'Confirm your email address',
    text: 'Click on the link in this email to confirm your email address',
    link: `https://eva-i-backend.vercel.app/api/auth/verify/${userId}/${token}`,
    textLink: 'Confirm email address',
    salutationText: 'Hi, thank you for creating an account!',
    actionText:
      'But before starting using EVA-I, please click on the link below to confirm your email address',
  };

  const mail = {
    to: email,
    from: NODEMAILER_EMAIL,
    subject:
      path === '/forgot-password'
        ? fogotPasswordMessage.subject
        : verifyAccountMessage.subject,
    text:
      path === '/forgot-password'
        ? fogotPasswordMessage.text
        : verifyAccountMessage.text,
    html: `
        <table style="border-spacing: 0px; border-collapse: collapse">
      <tbody>
        <tr>
          <td rowspan="2" style="width: 40px; height: 40px; padding: 0">
            <img
              src="https://i.ibb.co/q71QFCR/logo.png"
              alt="EVA-I Logo"
              width="40"
              height="40"
            />
          </td>
          <td
            style="
              padding: 0 0 0 16px;
              width: 100%;
              color: #07061f;
              font-family: Montserrat, sans-serif;
              font-size: 20px;
              font-style: normal;
              font-weight: 700;
              line-height: 23.2px;
            "
          >
            EVA-I
          </td>
        </tr>
        <tr>
          <td
            colspan="2"
            style="
              padding: 0 0 0 16px;
              color: #07061f;
              font-family: Montserrat, sans-serif;
              font-size: 14px;
              font-style: normal;
              font-weight: 400;
              line-height: 23.2px;
            "
          >
            AI Assistant
          </td>
        </tr>
        <tr>
          <td colspan="2" style="height: 23.2px; padding: 0"></td>
        </tr>
        <tr>
          <td
            colspan="2"
            style="
              height: 23.2px;
              padding: 0;
              font-family: Montserrat, sans-serif;
              font-size: 14px;
              font-style: normal;
              font-weight: 400;
              line-height: 24px;
            "
          >
            ${
              path === '/forgot-password'
                ? fogotPasswordMessage.salutationText
                : verifyAccountMessage.salutationText
            }
            <p></p>
            ${
              path === '/forgot-password'
                ? fogotPasswordMessage.actionText
                : verifyAccountMessage.actionText
            }
            <p></p>
            <a
              href="${
                path === '/forgot-password'
                  ? fogotPasswordMessage.link
                  : verifyAccountMessage.link
              }"
              style="
                font-family: Montserrat, sans-serif;
                font-size: 14px;
                font-style: normal;
                font-weight: 600;
                line-height: 24px;
                text-decoration-line: underline;
                color: #07061f;
              "
              >${
                path === '/forgot-password'
                  ? fogotPasswordMessage.textLink
                  : verifyAccountMessage.textLink
              }</a
            >
            <p></p>
            If you didn’t request this email, just ignore it.
            <p></p>
            Please note that the link will expire in 24 hours.
            <p></p>
            Best regards
            <br />
            EVA-I Team
          </td>
        </tr>
      </tbody>
    </table>
    `,
  };
  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendSmtpEmail };
