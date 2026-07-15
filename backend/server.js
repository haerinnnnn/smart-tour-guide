const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
require('./db');
const artifactRoutes = require('./routes/artifactRoutes');
const beaconRoutes = require('./routes/beaconRoutes');
<<<<<<< HEAD:backend/index.js
const dashboardRoutes = require('./routes/dashboardRoutes');
=======
const authRoutes = require('./routes/authRoutes');
>>>>>>> 3541eda8c1186093af7598913ad0a6603f1bb2c9:backend/server.js
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Smart Museum API is running smoothly' });
});
app.use('/api/artifacts', artifactRoutes);
app.use('/api/beacons', beaconRoutes);
<<<<<<< HEAD:backend/index.js
app.use('/api/dashboard', dashboardRoutes);
=======
app.use('/api', authRoutes);
>>>>>>> 3541eda8c1186093af7598913ad0a6603f1bb2c9:backend/server.js

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server Backend đang chạy tại: http://localhost:${PORT}`);
});
