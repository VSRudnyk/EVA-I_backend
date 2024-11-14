const { Assistant } = require('../../models/assistant.model');
const uploadAvatar = require('../../helpers/uploadAvatar');
const { v4: uuidv4 } = require('uuid');

const createAssistant = async (req, res) => {
  const { icon, color, description, welcomeMessage, name, assistantTheme } =
    req.body;
  const owner = req.user.id;
  const iconId = uuidv4();

  try {
    const uploadedAvatar = await uploadAvatar(iconId, icon);
    const createdAssistant = await Assistant.create({
      owner,
      icon: uploadedAvatar,
      iconId,
      color,
      description,
      welcomeMessage,
      name,
      assistantTheme,
    });
    res.status(201).json(createdAssistant);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

module.exports = createAssistant;
