// backend/db/connection.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a single MySQL connection using the credentials from .env
const dbPromise = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'sims_db'
});

// Since mysql.createConnection returns a Promise, we export the Promise itself.
// All parts of the app that need to query will 'await' this Promise.
module.exports = dbPromise;