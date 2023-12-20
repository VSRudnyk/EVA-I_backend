const jwt = require('jsonwebtoken');
require('dotenv').config();
const { User } = require('../../models/users.model');
const { createError } = require('../../helpers');
const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

const refreshToken = async (req, res) => {
  const { refreshToken: token } = req.body;
  try {
    const { id } = jwt.verify(token, REFRESH_SECRET_KEY);

    const isExist = await User.findOne({ refreshToken: token });
    if (!isExist) {
      const error = createError(401, 'Token invalid');
      throw error;
    }

    const payload = { id };

    const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, {
      expiresIn: '1d',
    });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
      expiresIn: '7d',
    });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    const refreshTokenError = createError(401, 'Token invalid');
    throw refreshTokenError;
  }
};

module.exports = refreshToken;
