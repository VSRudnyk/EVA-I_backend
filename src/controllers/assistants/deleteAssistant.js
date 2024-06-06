const { createError } = require('../../helpers');
const { Assistant } = require('../../models/assistant.model');

const updateAssistant = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteAssistant = await Assistant.findByIdAndDelete(id);

    if (!deleteAssistant) {
      const error = createError(404, 'Assistant not found');
      throw error;
    }

    res.status(204).json('Assistant was deleted');
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

module.exports = updateAssistant;
