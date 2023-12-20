const { createError } = require('../../helpers');
const { Database } = require('../../models/database.model');
const pinoLogger = require('../../../logger');

const createDatabase = async (req, res) => {
  const { tariffPlan } = req.body;
  const owner = req.user.id;

  const database = await Database.findOne({ owner });

  if (database) {
    const error = createError(409, 'This user is already used');
    throw error;
  }

  const createdDatabase = await Database.create({
    owner,
    tariffPlan,
  });
  res.status(201).json(createdDatabase);
  pinoLogger.info({ userId: owner }, 'Database created successfully');
};

module.exports = createDatabase;
