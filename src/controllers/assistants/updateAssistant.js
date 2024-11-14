const { Assistant } = require('../../models/assistant.model');
const uploadAvatar = require('../../helpers/uploadAvatar');

const updateAssistant = async (req, res, next) => {
  const { id } = req.params;
  const {
    icon,
    iconId,
    color,
    description,
    welcomeMessage,
    name,
    assistantTheme,
  } = req.body;

  const assistant = await Assistant.findById(id);

  const chekAssistantIcon = () => {
    if (icon === assistant.icon) {
      return icon;
    } else if (icon !== undefined) {
      const uploadedAvatar = uploadAvatar(iconId, icon);
      return uploadedAvatar;
    }
  };

  try {
    const icon = await chekAssistantIcon();

    const assistant = await Assistant.findByIdAndUpdate(
      { _id: id },
      {
        icon,
        color,
        description,
        welcomeMessage,
        name,
        assistantTheme,
      },
      { new: true, upsert: true }
    );

    res.json(assistant);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

module.exports = updateAssistant;
