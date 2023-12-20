const { Database } = require('../../models/database.model');

const getCurrentBot = async (req, res) => {
  const id = req.botDatabase._id;
  const currentBot = await Database.findById(id);

  res.status(200).json(currentBot);
};

module.exports = getCurrentBot;
