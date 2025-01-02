import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("jwtToken");

  // Sprawdź, czy token istnieje
  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    // Dekoduj token JWT
    const decodedToken = jwtDecode(token);

    // Sprawdź, czy token jest ważny (czas wygaśnięcia)
    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("userRole");
      return <Navigate to="/" />;
    }

    // Pobierz rolę użytkownika z tokena
    const userRole = localStorage.getItem("userRole");

    // Sprawdź, czy rola użytkownika pasuje do wymaganej
    if (userRole !== requiredRole) {
      return <Navigate to="/" />;
    }
  } catch (err) {
    console.error("Błąd podczas weryfikacji tokena:", err);
    return <Navigate to="/" />;
  }

  
  return children;
};

export default ProtectedRoute;
