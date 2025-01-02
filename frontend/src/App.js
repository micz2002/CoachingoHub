import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import RegisterTrainer from "./pages/RegisterTrainer";
import TrainerDashboard from "./pages/TrainerDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterTrainer />} />

        {/* Trasa chroniona dla trenera */}
        <Route
          path="/dashboard-trainer"
          element={
            <ProtectedRoute requiredRole="ROLE_TRAINER">
              <TrainerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Trasa chroniona dla klienta */}
        <Route
          path="/dashboard-client"
          element={
            <ProtectedRoute requiredRole="ROLE_CLIENT">
              <ClientDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
