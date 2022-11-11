const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

// Middleware
app.use(cors());
app.use(express.json()); // Access to req.body

app.listen(8080, () => {
    console.log('Server started on port 8080');
});