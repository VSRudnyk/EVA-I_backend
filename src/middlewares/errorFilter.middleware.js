const errorFilter = (error, req, res, next) => {
  const { status = 500, message = 'Something went wrong' } = error;
  res.status(status).json({ message });
};

module.exports = errorFilter;
