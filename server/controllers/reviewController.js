const pool = require('../config/dbConfig');

// Add a review for a product
exports.addReview = (req, res) => {
    const { product_id, rating, comment } = req.body;
    const userId = req.user.id; // Assuming user ID is available in req.user

    pool.query('INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
        [product_id, userId, rating, comment], (err, results) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            res.status(201).json({ message: 'Review added successfully', reviewId: results.insertId });
        });
};

// Get all reviews for a product
exports.getProductReviews = (req, res) => {
    const { product_id } = req.params;

    pool.query('SELECT r.*, u.name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = ?', [product_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json(results);
    });
};