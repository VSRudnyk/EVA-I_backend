const { createError } = require('../../helpers');
const { WaitList } = require('../../models/waitList.model');
const sendEmail = require('../../helpers/sendEmail');

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
    html: `<p>Користувач <strong>${name}</strong> був доданий до WaitList</p><br>
    <p>Email: ${email}</p><br>
    <p>Phone number: ${phoneNumber}</p><br>
    <p>Social link: ${socialLink}</p>
    `,
  };

  try {
    await sendEmail(mail);
    res.status(200).json(createdUser._doc);
  } catch (error) {
    res.json({ message: error.message });
  }
};

module.exports = addToWaitList;
