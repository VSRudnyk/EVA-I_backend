const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { User } = require('../../models/users.model');
const { createError } = require('../../helpers');
const pinoLogger = require('../../../logger');
const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    pinoLogger.error(
      `Sorry, can't find an account associated with address ${email}`
    );
    const error = createError(
      401,
      "Sorry, can't find an account associated with this address"
    );
    throw error;
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    pinoLogger.error('Wrong password');
    const error = createError(401, 'Wrong password');
    throw error;
  }

  if (!user.verify) {
    pinoLogger.error('Email not verified');
    const error = createError(403, 'Email not verified');
    throw error;
  }

  const payload = {
    id: user._id,
  };

  const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, { expiresIn: '1d' });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
    expiresIn: '7d',
  });

  const loginedUser = await User.findByIdAndUpdate(
    user._id,
    { accessToken, refreshToken },
    { new: true }
  ).select('-password');
  res.status(200).json(loginedUser);
  pinoLogger.info({ userId: user._id }, 'User was logged successfully');
};

module.exports = login;
