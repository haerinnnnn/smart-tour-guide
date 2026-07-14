const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/beacons
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tbl_beacons');

        const beaconDictionary = {};

        rows.forEach(beacon => {
            beaconDictionary[beacon.mac_address] = {
                uuid: beacon.uuid,
                major: beacon.major,
                minor: beacon.minor,
                name: beacon.location_name
            };
        });

        res.status(200).json({
            success: true,
            data: beaconDictionary
        });

    } catch (error) {
        console.error('❌ Lỗi khi lấy dữ liệu beacons:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống khi tải danh sách Beacon'
        });
    }
});

module.exports = router;