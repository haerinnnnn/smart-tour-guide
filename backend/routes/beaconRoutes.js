const express = require('express');
const router = express.Router();
const pool = require('../db'); // Lùi lại 1 thư mục để import pool kết nối từ db.js

// API: GET /api/beacons
// Chức năng: Lấy danh sách Beacon từ Database và format thành dạng Từ điển (Dictionary)
router.get('/', async (req, res) => {
    try {
        // Truy vấn lấy dữ liệu từ bảng tbl_beacons trên Aiven Cloud
        const [rows] = await pool.query('SELECT * FROM tbl_beacons');
        
        // Chuyển đổi mảng (Array) thành dạng Từ điển (Object) với Khóa là MAC Address
        const beaconDictionary = {};
        rows.forEach(beacon => {
            beaconDictionary[beacon.mac_address] = {
                uuid: beacon.uuid,
                major: beacon.major,
                minor: beacon.minor,
                name: beacon.artwork_name
            };
        });

        // Trả về JSON cho App React Native
        res.status(200).json({
            success: true,
            data: beaconDictionary
        });
    } catch (error) {
        console.error('❌ Lỗi khi lấy dữ liệu beacons:', error);
        res.status(500).json({ success: false, message: 'Lỗi hệ thống khi tải danh sách Beacon' });
    }
});

module.exports = router;