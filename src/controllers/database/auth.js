const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { Database } = require('../../models/database.model');
const { createError } = require('../../helpers');
const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

const auth = async (req, res) => {
  const { _id } = req.body;
  console.log(_id);

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

  const token = jwt.sign(payload, ACCESS_SECRET_KEY, { expiresIn: '1d' });
  //   const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
  //     expiresIn: '7d',
  //   });
console.log(botDatabase._id);
  const authBot = await Database.findByIdAndUpdate(
    botDatabase._id,
    { token },
    { new: true }
  );
  res.status(200).json(authBot);
};

module.exports = auth;
