
const express = require('express');
const router = express.Router();
const upload = require('../upload');
const {
    detectArtifact,
    getAllArtifacts,
    getArtifactById,
    createArtifact,
    updateArtifact,
    deleteArtifact,
    uploadFile,
    getStats,
} = require('../controllers/artifactController');

// Lưu ý: Tiền tố /api/artifacts sẽ được định nghĩa ở file index.js

// API nhận diện hiện vật qua Beacon (dùng cho Mobile App)
router.get('/detect', detectArtifact);

// API thống kê tổng quan cho Dashboard (đặt trước /:id để tránh xung đột route)
router.get('/stats', getStats);

// API upload file (Hình ảnh / Âm thanh) - field name: 'file'
router.post('/upload', upload.single('file'), uploadFile);

// CRUD Hiện vật (dùng cho Web Admin)
router.get('/', getAllArtifacts);
router.get('/:id', getArtifactById);
router.post('/', createArtifact);
router.put('/:id', updateArtifact);
router.delete('/:id', deleteArtifact);

module.exports = router;