import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import RegisterTrainer from "./pages/RegisterTrainer";
import TrainerDashboard from "./pages/asTrainer/TrainerDashboard";
import ClientDashboard from "./pages/AsClient/ClientDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ClientDetails from "./pages/asTrainer/ClientDetails";

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
           <Route
          path="/clients/:id"
          element={
            <ProtectedRoute requiredRole="ROLE_TRAINER">
              <ClientDetails />
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
