const { sign } = require('../../helpers');
require('dotenv').config();
const { Database } = require('../../models/database.model');
const { createError } = require('../../helpers');

const auth = async (req, res) => {
  const { _id } = req.body;

  const botDatabase = await Database.findOne({ _id });

  if (!botDatabase) {
    const error = createError(
      401,
      "Sorry, can't find an account associated with this id"
    );
    throw error;
  }

  const payload = {
    id: botDatabase._id,
  };

  const token = sign(payload, 'access', '1d');
  //   const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
  //     expiresIn: '7d',
  //   });

  const authBot = await Database.findByIdAndUpdate(
    botDatabase._id,
    { token },
    { new: true }
  );
  res.status(200).json(authBot);
};

module.exports = auth;
