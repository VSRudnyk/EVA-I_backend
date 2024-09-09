const { sign } = require('../../helpers');
require('dotenv').config();
const { Assistant } = require('../../models/assistant.model');
const { createError } = require('../../helpers');

const authAssistant = async (req, res) => {
  const { _id } = req.body;

  const assistantData = await Assistant.findOne({ _id });

  if (!assistantData) {
    const error = createError(
      401,
      "Sorry, can't find an account associated with this id"
    );
    throw error;
  }

  const payload = {
    id: assistantData._id,
    uniqueValue: Date.now(),
  };

  const token = sign(payload, 'access', '1d');
  //   const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
  //     expiresIn: '7d',
  //   });

  const authBot = await Assistant.findByIdAndUpdate(
    assistantData._id,
    { token },
    { new: true }
  );
  res.status(200).json(authBot);
};

module.exports = authAssistant;
