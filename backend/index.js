const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import Database để kích hoạt test connection
require('./db');

// Import Routes
const artifactRoutes = require('./routes/artifactRoutes');
const beaconRoutes = require('./routes/beaconRoutes');

const app = express();

// Middlewares
app.use(cors()); // Cho phép Mobile App và Web Admin gọi API khác domain
app.use(express.json()); // Hỗ trợ parse JSON body

// Phục vụ các file tĩnh trong thư mục uploads (dùng cho ảnh, âm thanh)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic Health Check Route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Smart Museum API is running smoothly' });
});

// Đăng ký Routes
app.use('/api/artifacts', artifactRoutes);
app.use('/api/beacons', beaconRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server Backend đang chạy tại: http://localhost:${PORT}`);
});
