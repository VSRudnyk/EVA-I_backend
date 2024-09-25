const { Assistant } = require('../../models/assistant.model');
const uploadAvatar = require('../../helpers/uploadAvatar');

const updateAssistant = async (req, res) => {
  const { id } = req.params;
  const {
    owner,
    tariffPlan,
    icon,
    color,
    description,
    welcomeMessage,
    name,
    assistantTheme,
  } = req.body;

  try {
    const avatarUrl = await uploadAvatar(id, icon);
    const assistant = await Assistant.findOneAndReplace(
      { _id: id },
      {
        owner,
        tariffPlan,
        color,
        description,
        welcomeMessage,
        name,
        assistantTheme,
        icon: avatarUrl,
      },
      { new: true, upsert: true }
    );

    res.json(assistant);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

module.exports = updateAssistant;
