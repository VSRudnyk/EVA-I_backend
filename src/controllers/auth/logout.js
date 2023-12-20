const { createError } = require('../../helpers');
const { User } = require('../../models/users.model');

const logout = async (req, res, next) => {
  const existingUser = await User.findById(req.user.id);
  if (!existingUser) {
    throw createError(401, 'Unauthorized (invalid access token)');
  }

  await User.findByIdAndUpdate(
    req.user.id,
    { accessToken: null, refreshToken: null },
    { new: true }
  ).select('-password');
  res.status(204).send();
};

module.exports = logout;
