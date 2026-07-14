import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard.tsx';
import BeaconManagement from './BeaconManagement.tsx';
import ArtifactManagement from './ArtifactManagement.tsx';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          {/* Tự động chuyển hướng từ gốc (/) sang trang /dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="beacons" element={<BeaconManagement />} />
          <Route path="artifacts" element={<ArtifactManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;