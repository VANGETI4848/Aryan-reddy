// filepath: c:\Aryan Reddy\app_server\models\db.js
require('dotenv').config();
const mongoose = require('mongoose');

const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aryan-reddy';

mongoose.connect(dbURI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log(`Mongoose connected to ${dbURI}`))
  .catch(err => console.error('Mongoose initial connection error:', err));

mongoose.connection.on('error', err => console.error('Mongoose connection error:', err));
mongoose.connection.on('disconnected', () => console.warn('Mongoose disconnected'));

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose disconnected through app termination (SIGINT)');
  process.exit(0);
});

module.exports = mongoose;