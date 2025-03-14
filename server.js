const { default: mongoose } = require('mongoose');
const app = require('./app');

const {
  DB_URI,
  PORT,
  NODE_ENV,
  MONGO_INITDB_ROOT_USERNAME,
  MONGO_INITDB_ROOT_PASSWORD,
} = process.env;

const startServer = async () => {
  try {
    if (NODE_ENV === 'development') {
      await mongoose.connect(
        `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongodb:27017/eva-backend?authSource=admin`,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );
    } else if (NODE_ENV === 'production') {
      await mongoose.connect(DB_URI);
    }
    app.listen(PORT || 3000, () =>
      console.log(`${NODE_ENV} database connection successful in port ${PORT}`)
    );
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

startServer();
