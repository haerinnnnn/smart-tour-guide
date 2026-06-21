import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import BeaconManagement from './BeaconManagement.tsx';
import ArtifactManagement from './ArtifactManagement.tsx';
import Login from './Login.tsx'; // Import trang Login

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* TRANG PUBLIC: Không có menu bên trái */}
        <Route path="/login" element={<Login />} />

        {/* TRANG QUẢN TRỊ: Được bọc trong khung AdminLayout */}
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="artifacts" replace />} />
          <Route path="beacons" element={<BeaconManagement />} />
          <Route path="artifacts" element={<ArtifactManagement />} />
          <Route path="dashboard" element={<div>Trang thống kê (Đang xây dựng...)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;