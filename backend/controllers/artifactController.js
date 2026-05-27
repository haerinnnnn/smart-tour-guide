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

module.exports = { detectArtifact };