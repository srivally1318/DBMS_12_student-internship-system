// backend/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const { exec } = require('child_process');
require('dotenv').config();

// ✅ Import MySQL connection
const dbPromise = require('./db/connection');

// ✅ Import API routes
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming request body payloads with JSON

// Use API routes
app.use('/api', apiRoutes);

// ✅ Serve Static Frontend Files
app.use(express.static(path.join(__dirname, '../frontend')));

// Catch-all route to serve frontend for unhandled browser paths
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Initialize server only after MySQL connection succeeds locally
dbPromise.then((connection) => {
    console.log('✅ MySQL connected successfully');
    
    // Start Server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        
        // Windows syntax to automatically open the default browser window upon startup
        exec(`start http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error('❌ Failed to connect to MySQL:', err.message);
    process.exit(1); // Automatically exit the backend process entirely if the connection fails
});