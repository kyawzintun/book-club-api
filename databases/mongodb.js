const mongoose = require('mongoose');

mongoose.Promise = Promise;

const dbHost = '<dbuser>:<dbpassword>@ds133476.mlab.com';
const dbPort = 123;
const dbName = '<dbname>';
const dbURI = `mongodb://${dbHost}:${dbPort}/${dbName}`;

function connect() {
  mongoose.connect(dbURI, { auto_reconnect: true })
    .catch(() => {});
}

module.exports = () => {
  const db = mongoose.connection;

  db.on('connecting', () => {
    console.log('Connecting to MongoDB...');
  });

  db.on('error', (err) => {
    console.log(`MongoDB connection error: ${err}`);
    mongoose.disconnect();
  });

  db.on('connected', () => {
    console.log('Connected to MongoDB!');
  });

  db.once('open', () => {
    console.log('MongoDB connection opened!');
  });

  db.on('reconnected', () => {
    console.log('MongoDB reconnected!');
  });

  db.on('disconnected', () => {
    console.log(`MongoDB disconnected! Reconnecting in 1000s...`);
  });

  connect();
};
