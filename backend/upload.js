const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Kiểm tra và tự động tạo thư mục 'uploads' nếu chưa tồn tại
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Loại bỏ khoảng trắng trong tên file gốc
        const safeName = file.originalname.replace(/\s+/g, '-');
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + safeName);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;