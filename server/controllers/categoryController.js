const pool = require('../config/dbConfig');

// Add a new category
exports.addCategory = (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Please provide a category name' });
    }

    pool.query('INSERT INTO categories (name, description) VALUES (?, ?)',
        [name, description], (err, results) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            res.status(201).json({ message: 'Category added successfully', categoryId: results.insertId });
        });
};