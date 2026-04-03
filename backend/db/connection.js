// backend/db/connection.js
require('dotenv').config();
const mysql = require('mysql2/promise');

const REQUIRED = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DB_PORT'];

function missingEnv() {
    return REQUIRED.filter((key) => !process.env[key] || String(process.env[key]).trim() === '');
}

function buildConnectionPromise() {
    const missing = missingEnv();
    if (missing.length > 0) {
        return Promise.reject(
            new Error(
                `Missing required environment variables: ${missing.join(', ')}. ` +
                    'In Render: Environment → set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT.'
            )
        );
    }

    const host = process.env.DB_HOST;
    const port = parseInt(String(process.env.DB_PORT), 10);
    const database = process.env.DB_NAME;

    if (!Number.isFinite(port)) {
        return Promise.reject(new Error(`DB_PORT must be a number, got: ${process.env.DB_PORT}`));
    }

    console.log(`[db] Connecting to MySQL at ${host}:${port} (database: ${database})`);

    return mysql.createConnection({
        host,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database,
        port,
        ssl: { rejectUnauthorized: true },
        connectTimeout: 30000,
    });
}

const dbPromise = buildConnectionPromise();

module.exports = dbPromise;
