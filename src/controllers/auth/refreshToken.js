const { sign, verify } = require('../../helpers');
require('dotenv').config();
const { User } = require('../../models/users.model');
const { createError } = require('../../helpers');

const refreshToken = async (req, res) => {
  const { refreshToken: token } = req.body;
  try {
    const { id } = verify(token, 'refresh');

    const isExist = await User.findOne({ refreshToken: token });
    if (!isExist) {
      const error = createError(401, 'Token invalid');
      throw error;
    }

    const payload = { id };

    const accessToken = sign(payload, 'access', '1d');
    const refreshToken = sign(payload, 'refresh', '7d');

    res.json({ accessToken, refreshToken });
  } catch (error) {
    const refreshTokenError = createError(401, 'Token invalid');
    throw refreshTokenError;
  }
};

module.exports = refreshToken;
