const pool = require('../db');

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

const createBeacon = async (req, res) => {
    try {
        const { mac_address, uuid, major, minor, location_name } = req.body;
        if (!uuid || major === undefined || minor === undefined || !location_name) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đủ thông tin: uuid, major, minor, location_name' });
        }
        const query = 'INSERT INTO beacons (mac_address, uuid, major, minor, location_name) VALUES (?, ?, ?, ?, ?)';
        const [result] = await pool.execute(query, [mac_address || null, uuid, parseInt(major), parseInt(minor), location_name]);

        return res.status(201).json({ 
            success: true, 
            message: 'Thêm Beacon thành công',
            data: { id: result.insertId, mac_address, uuid, major, minor, location_name }
        });
    } catch (error) {
        console.error('❌ Lỗi tại API createBeacon:', error.message);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
};

const updateBeacon = async (req, res) => {
    try {
        const { id } = req.params;
        const { mac_address, uuid, major, minor, location_name } = req.body;

        if (!uuid || major === undefined || minor === undefined || !location_name) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đủ thông tin cần cập nhật' });
        }
        const query = 'UPDATE beacons SET mac_address = ?, uuid = ?, major = ?, minor = ?, location_name = ? WHERE id = ?';
        const [result] = await pool.execute(query, [mac_address || null, uuid, parseInt(major), parseInt(minor), location_name, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy Beacon để cập nhật' });
        }

        return res.status(200).json({ success: true, message: 'Cập nhật Beacon thành công' });
    } catch (error) {
        console.error('❌ Lỗi tại API updateBeacon:', error.message);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
};

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