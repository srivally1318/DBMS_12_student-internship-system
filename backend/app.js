// backend/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const dbPromise = require('./db/connection');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.use(express.static(path.join(__dirname, '../frontend')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = Number(process.env.PORT) || 5000;

async function start() {
    try {
        await dbPromise;
        console.log('[db] MySQL connection successful');
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to connect to MySQL:', err.message);
        if (err.code) console.error('[db] MySQL error code:', err.code);
        if (err.errno != null) console.error('[db] MySQL errno:', err.errno);
        if (err.sqlState) console.error('[db] MySQL sqlState:', err.sqlState);
        console.error(
            'Hints: set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT on Render; ' +
                'do not set PORT manually. In Aiven, allow 0.0.0.0/0 (or public access) for MySQL.'
        );
        process.exit(1);
    }
}

start();
