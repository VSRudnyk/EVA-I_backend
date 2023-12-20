const ObjectID = require('bson-objectid');
const { User } = require('../../models/users.model');
const { sendSmtpEmail } = require('../../helpers/sendSmtpEmail');

const { FRONT_URL } = process.env;

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: 'Sorry, can’t find an account associated with this address',
      });
    }

    const token = ObjectID();
    user.resetPasswordToken = token;
    await user.save();
    const { password, ...userResponse } = user._doc;

    const message = {
      to: email,
      subject: 'Request to reset your EVA-I password',
      text: `Click on the link in this email to enter a new password`,
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
                Hi,
                <p></p>
                We’ve received a request to reset your EVA-I password.
                <p></p>
                If you didn’t make the request, just ignore this message. Otherwise,
                please click on the link below to enter a new password:
                <p></p>
                <a
                  href="${FRONT_URL}/reset-password"
                  style="
                    font-family: Montserrat, sans-serif;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 600;
                    line-height: 24px;
                    text-decoration-line: underline;
                    color: #07061f;
                  "
                  >Reset your password</a
                >
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

    await sendSmtpEmail(message);
    res.status(200).json(userResponse);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

module.exports = forgotPassword;
