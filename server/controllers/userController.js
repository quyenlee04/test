const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/dbConfig');

exports.register = async (req, res) => {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    try {
        // Kiểm tra xem email đã tồn tại chưa
        const [existingUsers] = await pool.promise().query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Thêm người dùng mới vào database
        const [result] = await pool.promise().query(
            'INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, phone, address]
        );

        return res.status(201).json({ message: 'User created successfully', userId: result.insertId });

    } catch (error) {
        return res.status(500).json({ message: 'Error creating user', error: error.sqlMessage || error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    try {
        // Tìm người dùng theo email
        const [users] = await pool.promise().query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Tạo token JWT
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ message: 'Login successful', token });

    } catch (error) {
        return res.status(500).json({ message: 'Error logging in', error: error.sqlMessage || error.message });
    }
};

// Get user profile
exports.getUserProfile = (req, res) => {
    const userId = req.user.id; // Assuming user ID is available in req.user

    pool.query('SELECT id, name, email, phone, address, profile_picture FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json(results[0]);
    });
};

// Update user profile
exports.updateUserProfile = (req, res) => {
    const userId = req.user.id; // Assuming user ID is available in req.user
    const { name, email, phone, address, profile_picture } = req.body;

    pool.query('UPDATE users SET name = ?, email = ?, phone = ?, address = ?, profile_picture = ? WHERE id = ?',
        [name, email, phone, address, profile_picture, userId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            res.status(200).json({ message: 'Profile updated successfully' });
        });
};