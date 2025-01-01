import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import RegisterTrainer from "./pages/RegisterTrainer";
import TrainerDashboard from "./pages/TrainerDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterTrainer />} />
        <Route path="/dashboard" element={<TrainerDashboard />} />

        {/* Dodaj kolejne trasy tutaj, np. rejestracja */}
      </Routes>
    </Router>
  );
};

export default App;
