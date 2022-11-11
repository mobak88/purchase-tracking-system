const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

// Middleware
app.use(cors());
app.use(express.json()); // Access to req.body

app.get('/', (req, res) => {
    res.send('Hello, World');
});


//Get all cards
app.get('/cards', async (req, res) => {
    try {
        const allCards = await pool.query('SELECT * FROM creditcard');
        res.json(allCards.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.listen(8080, () => {
    console.log('Server started on port 8080');
}); 