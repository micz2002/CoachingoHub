import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";


const ClientDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwtToken"); // Usuń token JWT
    localStorage.removeItem("userRole"); // Usuń rolę użytkownika
    navigate("/"); // Przekieruj na stronę logowania
  };

  

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <AppBar position="static" style={{ backgroundColor: "#0073e6" }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            CoachingoHub - Panel Klienta
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Wyloguj się
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" style={{ flexGrow: 1 }}>
        <Box mt={4}>
          <Typography variant="h4">Witaj w swoim panelu, Kliencie!</Typography>
        </Box>
      </Container>

      <Box
        component="footer"
        style={{
          backgroundColor: "#f1f1f1",
          padding: "10px 0",
          textAlign: "center",
          marginTop: "auto",
        }}
      >
        <Typography variant="body2" color="textSecondary">
          &copy; 2024 CoachingoHub. Wszelkie prawa zastrzeżone.
        </Typography>
      </Box>
    </Box>
  );
};

export default ClientDashboard;
