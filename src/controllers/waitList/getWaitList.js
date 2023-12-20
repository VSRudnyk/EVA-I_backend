const { WaitList } = require('../../models/waitList.model');

const getWaitList = async (req, res) => {
  
  const result = await WaitList.find();
  res.json(result);
};

module.exports = getWaitList;
