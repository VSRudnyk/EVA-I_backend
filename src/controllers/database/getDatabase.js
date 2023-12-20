const { createError } = require('../../helpers');
const { Database } = require('../../models/database.model');
const pinoLogger = require('../../../logger');

const getDatabase = async (req, res) => {
  try {
    const owner = req.user.id;
    const database = await Database.findOne({ owner });

    res.json(database);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
  
};

module.exports = getDatabase;
