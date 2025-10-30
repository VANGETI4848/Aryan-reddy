// filepath: c:\Aryan Reddy\app_server\models\db.js
require('dotenv').config();
const mongoose = require('mongoose');

const envUri = process.env.MONGODB_URI;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbHost = process.env.DB_HOST || 'cluster0.fphv38w.mongodb.net';
const dbName = process.env.DB_NAME || 'aryan-reddy';

// prefer full URI
let dbURI = envUri;
if (!dbURI && dbUser && dbPass) {
  const user = encodeURIComponent(dbUser);
  const pass = encodeURIComponent(dbPass);
  dbURI = `mongodb+srv://${user}:${pass}@${dbHost}/${dbName}?retryWrites=true&w=majority`;
}

if (!dbURI) {
  if (process.env.NODE_ENV === 'production') {
    console.error('No MONGODB_URI and no DB_USER/DB_PASS provided — skipping DB connect in production');
    module.exports = null;
    return;
  }
  // local fallback for development only
  dbURI = 'mongodb://127.0.0.1:27017/aryan-reddy';
}

mongoose.connect(dbURI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log(`Mongoose connected to ${dbURI}`))
  .catch(err => {
    console.error('Mongoose initial connection error:', err);
    // in production do not crash the process; adjust as needed
  });

mongoose.connection.on('error', err => console.error('Mongoose connection error:', err));
mongoose.connection.on('disconnected', () => console.warn('Mongoose disconnected'));

process.on('SIGINT', async () => {
  if (mongoose.connection.readyState) {
    await mongoose.connection.close();
    console.log('Mongoose disconnected through app termination (SIGINT)');
  }
  process.exit(0);
});

module.exports = mongoose;
