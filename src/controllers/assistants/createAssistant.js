// const { createError } = require('../../helpers');
const { Assistant } = require('../../models/assistant.model');

const createAssistant = async (req, res) => {
  const { icon, color, description, welcomeMessage, name, assistantTheme } =
    req.body;
  const owner = req.user.id;

  const createdAssistant = await Assistant.create({
    owner,
    icon,
    color,
    description,
    welcomeMessage,
    name,
    assistantTheme,
  });
  res.status(201).json(createdAssistant);
};

module.exports = createAssistant;
