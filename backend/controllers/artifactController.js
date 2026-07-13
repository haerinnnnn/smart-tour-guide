const pool = require('../db');
const visitCache = new Map();
const DEBOUNCE_TIME = 60 * 1000; 
const detectArtifact = async (req, res) => {
    try {
        const { uuid, major, minor } = req.query;

        if (!uuid || !major || !minor) {
            return res.status(400).json({ 
                success: false, 
                message: 'Thiếu thông số bắt buộc: uuid, major hoặc minor' 
            });
        }
        const query = `
            SELECT a.id, a.title, a.author, a.description, a.image_url, a.audio_url, b.location_name
            FROM artifacts a
            JOIN beacons b ON a.beacon_id = b.id
            WHERE b.uuid = ? AND b.major = ? AND b.minor = ?
        `;
        const [rows] = await pool.execute(query, [uuid, parseInt(major), parseInt(minor)]);
        if (rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Không tìm thấy hiện vật nào ở vị trí này' 
            });
        }

        const artifact = rows[0];
        const clientIp = req.ip || req.socket.remoteAddress; 
        const cacheKey = `${clientIp}_${artifact.id}`; 
        const lastVisitTime = visitCache.get(cacheKey);
        const now = Date.now();
        if (!lastVisitTime || (now - lastVisitTime) > DEBOUNCE_TIME) {
            const insertLogQuery = 'INSERT INTO visit_logs (artifact_id, created_at) VALUES (?, NOW())';
            await pool.execute(insertLogQuery, [artifact.id]);
            visitCache.set(cacheKey, now);
            console.log(`📝 Ghi nhận 1 lượt xem mới cho hiện vật: ${artifact.title} (ID: ${artifact.id})`);
        }

        return res.status(200).json({ success: true, data: artifact });
    } catch (error) {
        console.error('❌ Lỗi tại API detectArtifact:', error.message);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
};

const getAllArtifacts = async (req, res) => {
    try {
        const query = `
            SELECT a.*, b.location_name 
            FROM artifacts a
            LEFT JOIN beacons b ON a.beacon_id = b.id
            ORDER BY a.id ASC
        `;
        const [rows] = await pool.execute(query);
        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error('❌ Lỗi tại API getAllArtifacts:', error.message);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
};

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

const createArtifact = async (req, res) => {
    try {
        const { beacon_id, title, author, description, image_url, audio_url } = req.body;
        if (!title) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp tên hiện vật (title)' });
        }
        const query = 'INSERT INTO artifacts (beacon_id, title, author, description, image_url, audio_url) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await pool.execute(query, [beacon_id || null, title, author || 'Ẩn danh', description || '', image_url || null, audio_url || null]);
        
        return res.status(201).json({ success: true, message: 'Thêm hiện vật thành công', data: { id: result.insertId } });
    } catch (error) {
        console.error('❌ Lỗi tại API createArtifact:', error.message);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
};

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

const uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Không có file nào được tải lên' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    return res.status(200).json({ success: true, url: fileUrl });
};

module.exports = { detectArtifact, getAllArtifacts, getArtifactById, createArtifact, updateArtifact, deleteArtifact, uploadFile };