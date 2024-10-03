const { User } = require('../../models/users.model');

const updateTariffPlan = async (req, res) => {
  const { tariffPlan } = req.body;
  const id = req.user._id;

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { tariffPlan },
    { new: true }
  ).select('-password');
  res.status(200).json(updatedUser);
};

module.exports = updateTariffPlan;
