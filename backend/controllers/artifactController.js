const pool = require('../db');

// Khởi tạo bộ nhớ tạm để xử lý Debounce (chống spam log)
const visitCache = new Map();
const DEBOUNCE_TIME = 60 * 1000; // Thời gian chống nhiễu: 1 phút (60,000 milliseconds)

/**
 * Hàm xử lý API nhận diện hiện vật dựa trên tín hiệu Beacon
 * Input: req.query (chứa uuid, major, minor)
 * Output: JSON thông tin hiện vật (artifacts) hoặc lỗi 404 nếu không tìm thấy
 */
const detectArtifact = async (req, res) => {
    try {
        // 1. Lấy và kiểm tra tham số đầu vào từ URL Query
        const { uuid, major, minor } = req.query;

        if (!uuid || !major || !minor) {
            return res.status(400).json({ 
                success: false, 
                message: 'Thiếu thông số bắt buộc: uuid, major hoặc minor' 
            });
        }

        // 2. Viết câu lệnh SQL: Kết nối bảng artifacts và beacons
        const query = `
            SELECT a.id, a.title, a.author, a.description, a.image_url, a.audio_url, b.location_name
            FROM artifacts a
            JOIN beacons b ON a.beacon_id = b.id
            WHERE b.uuid = ? AND b.major = ? AND b.minor = ?
        `;

        // 3. Thực thi truy vấn
        const [rows] = await pool.execute(query, [uuid, parseInt(major), parseInt(minor)]);

        // 4. Xử lý kết quả trả về
        if (rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Không tìm thấy hiện vật nào ở vị trí này' 
            });
        }

        const artifact = rows[0];

        // 5. Logic ghi log lượt tham quan có Debounce
        const clientIp = req.ip || req.socket.remoteAddress; // Lấy IP của thiết bị
        const cacheKey = `${clientIp}_${artifact.id}`; // Tạo định danh: IP + ID bức tranh
        const lastVisitTime = visitCache.get(cacheKey);
        const now = Date.now();

        // Kiểm tra xem đã qua 1 phút kể từ lần cuối cùng quét bức tranh này chưa
        if (!lastVisitTime || (now - lastVisitTime) > DEBOUNCE_TIME) {
            // Thực hiện ghi vào Database
            const insertLogQuery = 'INSERT INTO visit_logs (artifact_id, created_at) VALUES (?, NOW())';
            await pool.execute(insertLogQuery, [artifact.id]);
            
            // Cập nhật thời điểm vừa xem vào cache
            visitCache.set(cacheKey, now);
            console.log(`📝 Ghi nhận 1 lượt xem mới cho hiện vật: ${artifact.title} (ID: ${artifact.id})`);
        }

        return res.status(200).json({ success: true, data: artifact });
    } catch (error) {
        console.error('❌ Lỗi tại API detectArtifact:', error.message);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
};

/**
 * Lấy danh sách tất cả các Hiện vật
 * Route: GET /api/artifacts
 */
const getAllArtifacts = async (req, res) => {
    try {
        const query = `
            SELECT a.*, b.location_name 
            FROM artifacts a
            LEFT JOIN beacons b ON a.beacon_id = b.id
            ORDER BY a.id DESC
        `;
        const [rows] = await pool.execute(query);
        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error('❌ Lỗi tại API getAllArtifacts:', error.message);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
};

/**
 * Lấy thông tin 1 Hiện vật theo ID
 * Route: GET /api/artifacts/:id
 */
const getArtifactById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM artifacts WHERE id = ?';
        const [rows] = await pool.execute(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy Hiện vật' });
        }
        return res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('❌ Lỗi tại API getArtifactById:', error.message);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
};

/**
 * Thêm mới 1 Hiện vật
 * Route: POST /api/artifacts
 */
const createArtifact = async (req, res) => {
    try {
        const { beacon_id, title, author, description, image_url, audio_url } = req.body;
        if (!title) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp tên hiện vật (title)' });
        }
        
        // beacon_id có thể truyền null nếu hiện vật chưa được gắn cảm biến
        const query = 'INSERT INTO artifacts (beacon_id, title, author, description, image_url, audio_url) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await pool.execute(query, [beacon_id || null, title, author || 'Ẩn danh', description || '', image_url || null, audio_url || null]);
        
        return res.status(201).json({ success: true, message: 'Thêm hiện vật thành công', data: { id: result.insertId } });
    } catch (error) {
        console.error('❌ Lỗi tại API createArtifact:', error.message);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
};

/**
 * Cập nhật thông tin Hiện vật
 * Route: PUT /api/artifacts/:id
 */
const updateArtifact = async (req, res) => {
    try {
        const { id } = req.params;
        const { beacon_id, title, author, description, image_url, audio_url } = req.body;
        if (!title) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp tên hiện vật (title)' });
        }
        const query = 'UPDATE artifacts SET beacon_id = ?, title = ?, author = ?, description = ?, image_url = ?, audio_url = ? WHERE id = ?';
        const [result] = await pool.execute(query, [beacon_id || null, title, author || 'Ẩn danh', description || '', image_url || null, audio_url || null, id]);
        
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Không tìm thấy hiện vật để cập nhật' });
        return res.status(200).json({ success: true, message: 'Cập nhật hiện vật thành công' });
    } catch (error) {
        console.error('❌ Lỗi tại API updateArtifact:', error.message);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
};

/**
 * Xóa 1 Hiện vật
 * Route: DELETE /api/artifacts/:id
 */
const deleteArtifact = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM artifacts WHERE id = ?';
        const [result] = await pool.execute(query, [id]);
        
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Không tìm thấy hiện vật để xóa' });
        return res.status(200).json({ success: true, message: 'Xóa hiện vật thành công' });
    } catch (error) {
        console.error('❌ Lỗi tại API deleteArtifact:', error.message);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
};

/**
 * API Upload File (Hình ảnh / Âm thanh)
 * Route: POST /api/artifacts/upload
 */
const uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Không có file nào được tải lên' });
    }
    // Trả về URL để Frontend lưu vào Database. Ví dụ: /uploads/1690000000000-image.png
    const fileUrl = `/uploads/${req.file.filename}`;
    return res.status(200).json({ success: true, url: fileUrl });
};

module.exports = { detectArtifact, getAllArtifacts, getArtifactById, createArtifact, updateArtifact, deleteArtifact, uploadFile };