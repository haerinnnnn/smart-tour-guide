const pool = require('../db');

// Xử lý Đăng nhập
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
        const [rows] = await pool.query(query, [username, password]);

        if (rows.length > 0) {
            const user = rows[0];
            res.status(200).json({ 
                success: true, 
                user_id: user.id,
                username: user.username,
                full_name: user.full_name
            });
        } else {
            res.status(401).json({ success: false, error: 'Sai tên đăng nhập hoặc mật khẩu' });
        }
    } catch (error) {
        console.error('Lỗi Login:', error);
        res.status(500).json({ success: false, error: 'Lỗi server' });
    }
};

// Xử lý Đăng ký
const register = async (req, res) => {
    try {
        const { username, password, full_name, phone } = req.body;
        
        // Kiểm tra user đã tồn tại chưa
        const checkQuery = 'SELECT * FROM users WHERE username = ?';
        const [checkRows] = await pool.query(checkQuery, [username]);
        
        if (checkRows.length > 0) {
            return res.status(400).json({ success: false, error: 'Tên đăng nhập đã tồn tại' });
        }

        // Tạo tài khoản mới
        const insertQuery = 'INSERT INTO users (username, password, full_name, phone) VALUES (?, ?, ?, ?)';
        await pool.query(insertQuery, [username, password, full_name, phone]);

        res.status(201).json({ success: true, message: 'Đăng ký thành công. Mời đăng nhập!' });
    } catch (error) {
        console.error('Lỗi Register:', error);
        res.status(500).json({ success: false, error: 'Lỗi server' });
    }
};

module.exports = { login, register };