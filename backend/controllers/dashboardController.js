const pool = require('../db');

/**
 * Thống kê tổng quan cho Dashboard
 * Route: GET /api/dashboard/stats
 */
const getDashboardStats = async (req, res) => {
    try {
        const [[artifactRow]] = await pool.execute('SELECT COUNT(*) AS total FROM artifacts');
        const [[beaconRow]] = await pool.execute('SELECT COUNT(*) AS total FROM beacons');
        const [[visitRow]] = await pool.execute('SELECT COUNT(*) AS total FROM visit_logs');
        const [[userRow]] = await pool.execute('SELECT COUNT(*) AS total FROM users');

        return res.status(200).json({
            success: true,
            data: {
                totalArtifacts: artifactRow.total,
                totalBeacons: beaconRow.total,
                totalVisits: visitRow.total,
                totalUsers: userRow.total,
            },
        });
    } catch (error) {
        console.error('❌ Lỗi tại API getDashboardStats:', error.message);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
};

/**
 * Lượt xem theo tháng (6 tháng gần nhất, kể cả tháng chưa có lượt xem nào)
 * Route: GET /api/dashboard/monthly-views
 */
const getMonthlyViews = async (req, res) => {
    try {
        const query = `
            SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS total
            FROM visit_logs
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 5 MONTH)
            GROUP BY month
            ORDER BY month ASC
        `;
        const [rows] = await pool.execute(query);

        // Đảm bảo luôn đủ 6 tháng gần nhất, tháng nào chưa có lượt xem thì để 0
        const now = new Date();
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            months.push(key);
        }

        const map = {};
        rows.forEach((r) => { map[r.month] = r.total; });

        const data = months.map((m) => ({
            month: m,
            total: map[m] || 0,
        }));

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('❌ Lỗi tại API getMonthlyViews:', error.message);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
};

/**
 * Top 5 hiện vật được xem nhiều nhất
 * Route: GET /api/dashboard/top-artifacts
 */
const getTopArtifacts = async (req, res) => {
    try {
        const query = `
            SELECT a.id, a.title, a.image_url, b.location_name, COUNT(v.id) AS views
            FROM artifacts a
            LEFT JOIN visit_logs v ON v.artifact_id = a.id
            LEFT JOIN beacons b ON a.beacon_id = b.id
            GROUP BY a.id
            ORDER BY views DESC
            LIMIT 5
        `;
        const [rows] = await pool.execute(query);
        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error('❌ Lỗi tại API getTopArtifacts:', error.message);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
};

/**
 * 10 lượt xem gần nhất (dùng làm "Hoạt động gần đây")
 * Route: GET /api/dashboard/recent-activities
 */
const getRecentActivities = async (req, res) => {
    try {
        const query = `
            SELECT v.id, v.created_at, a.id AS artifact_id, a.title, b.location_name
            FROM visit_logs v
            JOIN artifacts a ON v.artifact_id = a.id
            LEFT JOIN beacons b ON a.beacon_id = b.id
            ORDER BY v.created_at DESC
            LIMIT 10
        `;
        const [rows] = await pool.execute(query);
        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error('❌ Lỗi tại API getRecentActivities:', error.message);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
};

module.exports = { getDashboardStats, getMonthlyViews, getTopArtifacts, getRecentActivities };
