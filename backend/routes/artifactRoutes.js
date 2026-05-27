const express = require('express');
const router = express.Router();
const { detectArtifact } = require('../controllers/artifactController');

// Khai báo API GET /api/artifacts/detect
// Lưu ý: Tiền tố /api/artifacts sẽ được định nghĩa ở file index.js
router.get('/detect', detectArtifact);

module.exports = router;