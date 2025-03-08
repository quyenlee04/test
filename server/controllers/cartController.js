const pool = require('../config/dbConfig');


exports.getCartItems = (req, res) => {
    const userId = req.user.id; // Assuming user ID is available in req.user

    pool.query('SELECT * FROM cart WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json(results);
    });
};


exports.addToCart = (req, res) => {
    const { product_id, quantity } = req.body;
    const userId = req.user.id; // Assuming user ID is available in req.user
    console.log('🛒 User making request:', req.user); // Log dữ liệu user từ token
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized - No user info' });
    }

    pool.query('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, product_id, quantity], (err, results) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            res.status(201).json({ message: 'Item added to cart successfully', cartId: results.insertId });
        });
};

exports.updateCartItem = (req, res) => {
    const { cart_id, quantity } = req.body;

    pool.query('UPDATE cart SET quantity = ? WHERE id = ?', [quantity, cart_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ message: 'Cart item updated successfully' });
    });
};

exports.removeCartItem = (req, res) => {
    const { cart_id } = req.body;

    pool.query('DELETE FROM cart WHERE id = ?', [cart_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ message: 'Cart item removed successfully' });
    });
};