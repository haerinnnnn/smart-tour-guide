const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getMonthlyViews,
    getTopArtifacts,
    getRecentActivities,
} = require('../controllers/dashboardController');

// Tiền tố /api/dashboard được định nghĩa ở index.js

router.get('/stats', getDashboardStats);
router.get('/monthly-views', getMonthlyViews);
router.get('/top-artifacts', getTopArtifacts);
router.get('/recent-activities', getRecentActivities);

module.exports = router;
