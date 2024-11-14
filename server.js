const { default: mongoose } = require('mongoose');
const app = require('./app');

const { DB_URI, PORT } = process.env;

const startServer = async () => {
  try {
    await mongoose.connect(DB_URI);
    app.listen(PORT || 3000, () =>
      console.log(`Database connection successful in port ${PORT}`)
    );
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

startServer();
