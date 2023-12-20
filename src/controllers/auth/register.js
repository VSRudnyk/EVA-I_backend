const bcrypt = require('bcryptjs');
const ObjectID = require('bson-objectid');
const pinoLogger = require('../../../logger');
const { createError } = require('../../helpers');
const { User } = require('../../models/users.model');
const { sendSmtpEmail } = require('../../helpers/sendSmtpEmail');

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    pinoLogger.error(`${email} is already used`);
    const error = createError(409, 'This email address is already used');
    throw error;
  }
  const hashPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));
  const verificationCode = ObjectID();

  const newUser = await User.create({
    email,
    password: hashPassword,
    verificationCode,
  });

  const { password: userPassword, ...userResponse } = newUser._doc;

  const mail = {
    to: email,
    subject: 'Confirm your email address',
    text: 'Click on the link in this email to confirm your email address',
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
            Hi, thank you for creating an account!
            <p></p>
            But before starting using EVA-I, please click on the link below to
            confirm your email address:
            <p></p>
            <a
              href="https://aibot-back-end.onrender.com/api/auth/verify/${verificationCode}"
              style="
                font-family: Montserrat, sans-serif;
                font-size: 14px;
                font-style: normal;
                font-weight: 600;
                line-height: 24px;
                text-decoration-line: underline;
                color: #07061f;
              "
              >Confirm email address</a
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
    await sendSmtpEmail(mail);
    res.status(200).json(userResponse);
    pinoLogger.info(
      `An email to complete registration was successfully sent to ${email}`
    );
  } catch (error) {
    res.status(error.status).json({ message: error.message });
    pinoLogger.error(error.message);
  }
};

module.exports = register;
