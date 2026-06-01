const pool = require('../db');

/**
 * Lấy danh sách tất cả các Beacon
 * Route: GET /api/beacons
 */
const getAllBeacons = async (req, res) => {
    try {
        const query = 'SELECT * FROM beacons ORDER BY id DESC';
        const [rows] = await pool.execute(query);
        
        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error('❌ Lỗi tại API getAllBeacons:', error.message);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
};

/**
 * Lấy thông tin 1 Beacon cụ thể theo ID
 * Route: GET /api/beacons/:id
 */
const getBeaconById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM beacons WHERE id = ?';
        const [rows] = await pool.execute(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy Beacon' });
        }

        return res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('❌ Lỗi tại API getBeaconById:', error.message);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
};

/**
 * Thêm mới 1 thiết bị Beacon
 * Route: POST /api/beacons
 */
const createBeacon = async (req, res) => {
    try {
        const { uuid, major, minor, location_name } = req.body;

        if (!uuid || major === undefined || minor === undefined || !location_name) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đủ thông tin: uuid, major, minor, location_name' });
        }

        const query = 'INSERT INTO beacons (uuid, major, minor, location_name) VALUES (?, ?, ?, ?)';
        const [result] = await pool.execute(query, [uuid, parseInt(major), parseInt(minor), location_name]);

        return res.status(201).json({ 
            success: true, 
            message: 'Thêm Beacon thành công',
            data: { id: result.insertId, uuid, major, minor, location_name }
        });
    } catch (error) {
        console.error('❌ Lỗi tại API createBeacon:', error.message);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
};

/**
 * Cập nhật thông tin Beacon
 * Route: PUT /api/beacons/:id
 */
const updateBeacon = async (req, res) => {
    try {
        const { id } = req.params;
        const { uuid, major, minor, location_name } = req.body;

        if (!uuid || major === undefined || minor === undefined || !location_name) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đủ thông tin cần cập nhật' });
        }

        const query = 'UPDATE beacons SET uuid = ?, major = ?, minor = ?, location_name = ? WHERE id = ?';
        const [result] = await pool.execute(query, [uuid, parseInt(major), parseInt(minor), location_name, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy Beacon để cập nhật' });
        }

        return res.status(200).json({ success: true, message: 'Cập nhật Beacon thành công' });
    } catch (error) {
        console.error('❌ Lỗi tại API updateBeacon:', error.message);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
};

/**
 * Xóa 1 Beacon
 * Route: DELETE /api/beacons/:id
 */
const deleteBeacon = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM beacons WHERE id = ?';
        const [result] = await pool.execute(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy Beacon để xóa' });
        }

        return res.status(200).json({ success: true, message: 'Xóa Beacon thành công' });
    } catch (error) {
        console.error('❌ Lỗi tại API deleteBeacon:', error.message);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
};

module.exports = { getAllBeacons, getBeaconById, createBeacon, updateBeacon, deleteBeacon };