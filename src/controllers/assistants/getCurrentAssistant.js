const { Assistant } = require('../../models/assistant.model');

const getCurrentAssistant = async (req, res) => {
  const id = req.assistantData._id;
  const assistant = await Assistant.findById(id);

  res.status(200).json(assistant);
};

module.exports = getCurrentAssistant;
