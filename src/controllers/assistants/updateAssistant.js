const { Assistant } = require('../../models/assistant.model');
const uploadAvatar = require('../../helpers/uploadAvatar');

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
    avatarAssistant,
  } = req.body;

  try {
    const avatarUrl = await uploadAvatar(id, avatarAssistant);
    console.log(avatarUrl);
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
        avatarAssistant: avatarUrl,
      },
      { new: true, upsert: true }
    );

    res.json(assistant);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

module.exports = updateAssistant;
