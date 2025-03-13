const { User } = require('../../models/users.model');
const { createError } = require('../../helpers');

const updateTariffPlan = async (req, res) => {
  try {
    const { tariffPlan } = req.body;
    const id = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { tariffPlan },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      throw createError(404, 'User not found');
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message });
  }
};

module.exports = updateTariffPlan;
