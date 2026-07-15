const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
require('./db');
const artifactRoutes = require('./routes/artifactRoutes');
const beaconRoutes = require('./routes/beaconRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Smart Museum API is running smoothly' });
});
app.use('/api/artifacts', artifactRoutes);
app.use('/api/beacons', beaconRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server Backend đang chạy tại: http://localhost:${PORT}`);
});
