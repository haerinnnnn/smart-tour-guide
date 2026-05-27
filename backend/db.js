const mysql = require('mysql2/promise');
require('dotenv').config();

// Khởi tạo Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false // Bắt buộc khi kết nối tới Cloud Database (như Aiven)
    }
});

// Kiểm tra kết nối ngay khi khởi động
pool.getConnection()
    .then(connection => {
        console.log('✅ Kết nối cơ sở dữ liệu MySQL thành công!');
        connection.release();
    })
    .catch(error => console.error('❌ Lỗi kết nối CSDL:', error.message));

module.exports = pool;
