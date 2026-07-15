import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./AdminLayout";

import Dashboard from "./pages/Dashboard/Dashboard";
import BeaconManagement from "./pages/Beacons/BeaconManagement";
import ArtifactManagement from "./pages/Artifacts/ArtifactManagement";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;