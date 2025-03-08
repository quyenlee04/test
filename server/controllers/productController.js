const pool = require('../config/dbConfig');

exports.getAllProducts = (req, res) => {
    pool.query('SELECT * FROM products', (err, results) => {
        if (err) {
            return res.status(500).json({message: err.message});
        }
         res.status(200).json(results);
    });
};

exports.addProduct = (req, res) => {
    const { name, description, price, image_url, stock, brand, category_id } = req.body;
    if (!name || !price) {
        return res.status(400).json({ message: 'Please provide name and price' });
    }
    pool.query('INSERT INTO products (name, description, price, image_url, stock, brand, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, description, price, image_url, stock, brand, category_id], (err, results) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            res.status(201).json({ message: 'Product added successfully', productId: results.insertId });
        });
};



