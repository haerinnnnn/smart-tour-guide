<<<<<<< HEAD
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./AdminLayout";

import Dashboard from "./pages/Dashboard/Dashboard";
import BeaconManagement from "./pages/Beacons/BeaconManagement";
import ArtifactManagement from "./pages/Artifacts/ArtifactManagement";
=======
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import BeaconManagement from './BeaconManagement.tsx';
import ArtifactManagement from './ArtifactManagement.tsx';
import Login from './Login.tsx'; // Import trang Login
>>>>>>> 3541eda8c1186093af7598913ad0a6603f1bb2c9

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* TRANG PUBLIC: Không có menu bên trái */}
        <Route path="/login" element={<Login />} />

        {/* TRANG QUẢN TRỊ: Được bọc trong khung AdminLayout */}
        <Route path="/" element={<AdminLayout />}>
<<<<<<< HEAD
          <Route
            index
            element={<Navigate to="/dashboard" replace />}
          />

          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          <Route
            path="beacons"
            element={<BeaconManagement />}
          />

          <Route
            path="artifacts"
            element={<ArtifactManagement />}
          />
=======
          <Route index element={<Navigate to="artifacts" replace />} />
          <Route path="beacons" element={<BeaconManagement />} />
          <Route path="artifacts" element={<ArtifactManagement />} />
          <Route path="dashboard" element={<div>Trang thống kê (Đang xây dựng...)</div>} />
>>>>>>> 3541eda8c1186093af7598913ad0a6603f1bb2c9
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;