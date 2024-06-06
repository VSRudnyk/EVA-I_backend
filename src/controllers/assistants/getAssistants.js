const { createError } = require('../../helpers');
const { Assistant } = require('../../models/assistant.model');

const getAssistants = async (req, res) => {
  
  try {
    const owner = req.user._id.toString();
    const assistants = await Assistant.find({ owner });
    res.json(assistants);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
  
};

module.exports = getAssistants;
