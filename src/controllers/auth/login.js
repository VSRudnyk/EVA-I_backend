const bcrypt = require('bcryptjs');
const { sign } = require('../../helpers');
require('dotenv').config();
const { User } = require('../../models/users.model');
const { createError } = require('../../helpers');

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    const error = createError(401, 'Wrong email or password');
    throw error;
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    const error = createError(401, 'Wrong email or password');
    throw error;
  }

  if (!user.verify) {
    const error = createError(403, 'Email not verified');
    throw error;
  }

  const payload = {
    id: user._id,
    uniqueValue: Date.now(),
  };

  const accessToken = sign(payload, 'access', '5m');
  const refreshToken = sign(payload, 'refresh', '7d');

  const loginedUser = await User.findByIdAndUpdate(
    user._id,
    { accessToken, refreshToken, resetPasswordToken: null },
    { new: true }
  ).select('-password');
  res.status(200).json(loginedUser);
};

module.exports = login;
