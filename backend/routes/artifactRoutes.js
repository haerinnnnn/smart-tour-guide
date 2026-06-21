const express = require('express');
const router = express.Router();

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
router.put('/:id', updateArtifact);
router.delete('/:id', deleteArtifact);

module.exports = router;