const jwt = require('jsonwebtoken');
const { User } = require('../../models/users.model');

const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

const googleAuth = async (req, res) => {
  const { _id: id } = req.user;

  const payload = {
    id,
  };

  const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, {
    expiresIn: '1d',
  });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
    expiresIn: '7d',
  });
  await User.findByIdAndUpdate(id, {
    accessToken,
    refreshToken,
    verify: true,
  });
  res.redirect(
    `http://localhost:5173?accessToken=${accessToken}&refreshToken=${refreshToken}`
  );
};

module.exports = googleAuth;
