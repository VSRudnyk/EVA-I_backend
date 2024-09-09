const { sign, verify } = require('../../helpers');
require('dotenv').config();
const { User } = require('../../models/users.model');
const { createError } = require('../../helpers');

const refreshToken = async (req, res) => {
  const { refreshToken: token } = req.body;
  try {
    const { id } = verify(token, 'refresh');

    const user = await User.findOne({ refreshToken: token });
    if (!user) {
      const error = createError(401, 'Token invalid');
      throw error;
    }

    const payload = { id, uniqueValue: Date.now() };

    const accessToken = sign(payload, 'access', '1m');
    const refreshToken = sign(payload, 'refresh', '5m');

    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ accessToken, refreshToken });
  } catch (error) {
    const refreshTokenError = createError(401, 'Token invalid');
    throw refreshTokenError;
  }
};

module.exports = refreshToken;
