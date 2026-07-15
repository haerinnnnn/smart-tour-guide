const express = require('express');
const router = express.Router();
<<<<<<< HEAD
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
=======

// Import toàn bộ các hàm từ Controller
const { 
    detectArtifact, 
    getAllArtifacts, 
    getArtifactById, 
    createArtifact, 
    updateArtifact, 
    deleteArtifact 
} = require('../controllers/artifactController');

// 1. API dành cho App điện thoại (Quét BLE)
router.get('/detect', detectArtifact);

// 2. API dành cho Web Admin (CRUD Hiện vật)
router.get('/', getAllArtifacts);
router.post('/', createArtifact);
router.get('/:id', getArtifactById);
>>>>>>> 3541eda8c1186093af7598913ad0a6603f1bb2c9
router.put('/:id', updateArtifact);
router.delete('/:id', deleteArtifact);

module.exports = router;