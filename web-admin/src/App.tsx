import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import BeaconManagement from './BeaconManagement.tsx';
import ArtifactManagement from './ArtifactManagement.tsx';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
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
