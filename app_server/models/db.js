// filepath: c:\Aryan Reddy\app_server\models\db.js
require('dotenv').config();
const mongoose = require('mongoose');

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbHost = process.env.DB_HOST || 'cluster0.fphv38w.mongodb.net';
const dbName = process.env.DB_NAME || 'aryan-reddy';

// If you provide a full MONGODB_URI, prefer that (useful for local testing)
let dbURI = process.env.MONGODB_URI;
if (!dbURI) {
  if (!dbUser || !dbPass) {
    console.warn('DB_USER or DB_PASS not set — falling back to localhost if available');
    dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aryan-reddy';
  } else {
    const user = encodeURIComponent(dbUser);
    const pass = encodeURIComponent(dbPass);
    dbURI = `mongodb+srv://${user}:${pass}@${dbHost}/${dbName}?retryWrites=true&w=majority`;
  }
}

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
