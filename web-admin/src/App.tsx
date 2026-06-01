import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import BeaconManagement from './BeaconManagement.tsx';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          {/* Tự động chuyển hướng từ gốc (/) sang trang /dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Các trang con tạm thời hiển thị Text để kiểm thử */}
          <Route path="dashboard" element={<div>Trang thống kê (Đang xây dựng...)</div>} />
          <Route path="beacons" element={<BeaconManagement />} />
          <Route path="artifacts" element={<div>Trang quản lý Hiện vật (Đang xây dựng...)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
