const bcrypt = require('bcryptjs');
const { sign, verify } = require('../../helpers');
const { createError } = require('../../helpers');
const { User } = require('../../models/users.model');
const { sendSmtpEmail } = require('../../helpers/sendSmtpEmail');

const register = async (req, res) => {
  const { email, password, name } = req.body;
  const user = await User.findOne({ email });

  if ((user && user.verify) || (user && !user.verify)) {
    const error = createError(409, 'This email address is already used');
    throw error;
  }

  if (user) {
    const isTokenExpired = verify(user.verificationCode, 'access');
    if (!isTokenExpired) {
      await User.findOneAndDelete({ email });
    }
  }

  const hashPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));
  const verificationCode = sign(
    {
      userEmail: email,
      uniqueValue: Date.now(),
    },
    'access',
    '15m'
  );

  const expireAt = new Date();
  expireAt.setMinutes(expireAt.getMinutes() + 15);

  const newUser = await User.create({
    email,
    name,
    password: hashPassword,
    verificationCode,
    expireAt,
  });

  const { password: userPassword, ...userResponse } = newUser._doc;

  try {
    await sendSmtpEmail(email, verificationCode, '/verification');
    res.status(200).json(userResponse);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

module.exports = register;
