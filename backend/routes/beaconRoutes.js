const express = require('express');
const router = express.Router();
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
