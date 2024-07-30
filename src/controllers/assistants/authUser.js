require('dotenv').config();
const { Assistant } = require('../../models/assistant.model');
const { createError } = require('../../helpers');

const authUser = async (req, res) => {
  const { name, email } = req.body;

  const assistantData = req.assistantData;

  if (!assistantData) {
    const error = createError(
      401,
      "Sorry, can't find an account associated with this id"
    );
    throw error;
  }

  const authUser = await Assistant.findById(assistantData._id);

  authUser.users.push({ name, email });
  await authUser.save();

  res.status(200).json(authUser);
};

module.exports = authUser;
