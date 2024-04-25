const { createError } = require('../../helpers');
const { WaitList } = require('../../models/waitList.model');
const { sendSmtpEmail } = require('../../helpers/sendSmtpEmail');

const { PROJECT_EMAIL } = process.env;

const addToWaitList = async (req, res) => {
  const { name, email, phoneNumber, socialLink } = req.body;

  const user = await WaitList.findOne({ email });
  if (user) {
    const error = createError(409, 'This email address is already used');
    throw error;
  }

  const createdUser = await WaitList.create({
    name,
    email,
    phoneNumber,
    socialLink,
  });

  const mail = {
    to: PROJECT_EMAIL,
    subject: 'Оновлення в WaitList',
    html: `  <table style="border-spacing: 0px; border-collapse: collapse">
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
          <p>Користувач <strong>${name}</strong> був доданий до WaitList</p>
          <p>Email: ${email}</p>
          <p>Phone number: ${phoneNumber}</p>
          <p>Social link: ${socialLink}</p>
        </td>
      </tr>
    </tbody>
  </table>
    `,
  };

  try {
    await sendSmtpEmail(mail);
    res.status(200).json(createdUser._doc);
  } catch (error) {
    res.json({ message: error.message });
  }
};

module.exports = addToWaitList;
