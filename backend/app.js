// backend/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// ✅ Import MySQL connection
const dbPromise = require('./db/connection');

// ✅ Import API routes
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses JSON request bodies

// API routes
app.use('/api', apiRoutes);

// ✅ Serve Static Frontend Files
app.use(express.static(path.join(__dirname, '../frontend')));

// Catch-all route to serve frontend for unhandled paths
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Initialize server only after MySQL connection succeeds
dbPromise.then(() => {
    console.log('✅ MySQL connected successfully');

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        // ⚠️ Removed Windows-specific browser opening for production
    });
}).catch((err) => {
    console.error('❌ Failed to connect to MySQL:', err.message);
    process.exit(1); // Exit backend if connection fails
});