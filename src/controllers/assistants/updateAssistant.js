const { Assistant } = require('../../models/assistant.model');

const updateAssistant = async (req, res) => {
  const { id } = req.params;
  const {
    questionAnswer,
    owner,
    tariffPlan,
    tags,
    address,
    hiBye,
    defaultSalutation,
    pricefinder,
    settings,
    createdAt,
    updatedAt,
    priceList,
  } = req.body;
  try {
    const assistant = await Assistant.findOneAndReplace(
      { _id: id },
      {
        questionAnswer,
        owner,
        tariffPlan,
        tags,
        address,
        hiBye,
        defaultSalutation,
        pricefinder,
        settings,
        createdAt,
        updatedAt,
        priceList,
      },
      { new: true, upsert: true }
    );

    res.json(assistant);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

module.exports = updateAssistant;
