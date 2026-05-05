const express = require('express');
const pool = require('./db'); // Your DB connection
const app = express();

app.set('view engine', 'ejs');

// PAGE 1: List all products
app.get('/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products');
        res.render('index', { items: result.rows });
    } catch (err) {

        console.error("Error fetching products:", err.message);
        res.status(500).send("Database Error");
    }
});

// PAGE 2: Show one specific product
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).send("Item not found");
        
        res.render('detail', { item: result.rows[0] });
    } catch (err) {
        console.error("Error fetching product detail:", err.message);
        res.status(500).send("Database Error");
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));