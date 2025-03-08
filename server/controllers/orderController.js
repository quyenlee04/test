const pool = require('../config/dbConfig');


exports.createOrder = (req, res) => {
    const { shipping_address } = req.body;
    const userId = req.user.id; // Assuming user ID is available in req.user

    // First, calculate the total amount from the cart
    pool.query('SELECT SUM(p.price * c.quantity) AS total_amount FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }

        const totalAmount = results[0].total_amount;

        // Create the order
        pool.query('INSERT INTO orders (user_id, total_amount, shipping_address) VALUES (?, ?, ?)',
            [userId, totalAmount, shipping_address], (err, results) => {
                if (err) {
                    return res.status(500).json({ message: err.message });
                }

                // Clear the cart after creating the order
                pool.query('DELETE FROM cart WHERE user_id = ?', [userId], (err) => {
                    if (err) {
                        return res.status(500).json({ message: err.message });
                    }
                    res.status(201).json({ message: 'Order created successfully', orderId: results.insertId });
                });
            });
    });
};


exports.getUserOrders = (req, res) => {
    const userId = req.user.id; // Assuming user ID is available in req.user

    pool.query('SELECT * FROM orders WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json(results);
    });
};