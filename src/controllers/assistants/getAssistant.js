const { Assistant } = require('../../models/assistant.model');

const getAssistant = async (req, res) => {
    const { id } = req.params;
  try {
    const assistant = await Assistant.findById(id);
    res.json(assistant);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
  
};

module.exports = getAssistant;
