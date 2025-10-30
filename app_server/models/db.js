require('dotenv').config();
const mongoose = require('mongoose');

const dbURI = process.env.MONGODB_URI || 'mongodb+srv://23eg106b61_db_user:ARYan%40123@cluster0.fphv38w.mongodb.net/?appName=Cluster0';

mongoose.connect(dbURI)
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