const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const {
    getAllBeacons,
    getBeaconById,
    createBeacon,
    updateBeacon,
    deleteBeacon,
} = require('../controllers/beaconController');

// Tiền tố /api/beacons được định nghĩa ở index.js

router.get('/', getAllBeacons);
router.get('/:id', getBeaconById);
router.post('/', createBeacon);
router.put('/:id', updateBeacon);
router.delete('/:id', deleteBeacon);

module.exports = router;
=======
const pool = require('../db');
const { 
    getAllBeacons, 
    getBeaconById, 
    createBeacon, 
    updateBeacon, 
    deleteBeacon 
} = require('../controllers/beaconController');
router.get('/dictionary', async (req, res) => {
    try {
        const query = `
            SELECT 
                b.mac_address, b.uuid, b.major, b.minor, b.location_name, a.title AS name 
            FROM beacons b
            LEFT JOIN artifacts a ON b.id = a.beacon_id;
        `;
        const [rows] = await pool.query(query);
        
        const beaconDictionary = {};
        rows.forEach(beacon => {
            if (beacon.mac_address) {
                beaconDictionary[beacon.mac_address] = {
                    uuid: beacon.uuid,
                    major: beacon.major,
                    minor: beacon.minor,
                    name: beacon.name || beacon.location_name 
                };
            }
        });
        res.status(200).json({ success: true, data: beaconDictionary });
    } catch (error) {
        console.error('❌ Lỗi:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

router.get('/', getAllBeacons);
router.post('/', createBeacon);
router.get('/:id', getBeaconById);
router.put('/:id', updateBeacon);
router.delete('/:id', deleteBeacon);

module.exports = router;
>>>>>>> 3541eda8c1186093af7598913ad0a6603f1bb2c9
