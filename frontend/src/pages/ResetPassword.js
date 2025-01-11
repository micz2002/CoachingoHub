import React, { useState } from "react";
import { TextField, Button, Typography, Box, AppBar, Toolbar, Container } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    try {
      await axios.post("http://localhost:8080/api/users/reset-password", null, {
        params: { token, newPassword },
      });
      setMessage("Hasło zostało pomyślnie zresetowane.");
      setError("");
      // Przekierowanie do logowania
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      setError("Nie udało się zresetować hasła. Spróbuj ponownie.");
    }
  };

  return (
    <>
      <AppBar position="static" style={{ backgroundColor: "#0073e6" }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, color: "white" }}>
            CoachingoHub
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#f9f9f9",
          padding: "20px",
        }}
      >
        <Box
          style={{
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            maxWidth: "400px",
            width: "100%",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Zresetuj hasło
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          {message && <Typography color="primary">{message}</Typography>}
          <TextField
            label="Podaj token"
            fullWidth
            margin="normal"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <TextField
            label="Nowe hasło"
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "20px" }}
            onClick={handleResetPassword}
          >
            Zresetuj hasło
          </Button>
        </Box>
      </Box>

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
    </>
  );
};

export default ResetPassword;
