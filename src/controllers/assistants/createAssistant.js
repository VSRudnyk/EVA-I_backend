const { createError } = require('../../helpers');
const { Assistant } = require('../../models/assistant.model');

const createAssistant = async (req, res) => {
  const { tariffPlan } = req.body;
  const owner = req.user.id;

  const createdDatabase = await Assistant.create({
    owner,
    tariffPlan,
  });
  res.status(201).json(createdDatabase);
};

module.exports = createAssistant;
