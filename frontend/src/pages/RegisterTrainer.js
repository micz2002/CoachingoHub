import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Container, Typography, Box, AppBar, Toolbar } from "@mui/material";

const RegisterTrainer = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    specialization: "",
    experience: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      await axios.post("http://localhost:8080/api/users/register-trainer", formData);
      setSuccess(true);
    } catch (err) {
      setError("Rejestracja nie powiodła się. Spróbuj ponownie.");
    }
  };

  return (
    <>
      <AppBar position="static" style={{ backgroundColor: "#0073e6" }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, color: "white" }}>
          CoachingoHub
          </Typography>
          <Button color="inherit" style={{ marginRight: "10px" }} href="/">
            Zaloguj się
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm">
        <Box
          mt={8}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#f9f9f9",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Rejestracja Trenera
          </Typography>
          {success && (
            <Typography color="primary" gutterBottom>
              Rejestracja przebiegła pomyślnie! Czekaj na zatwierdzenie konta przez administratora (do 24h).
            </Typography>
          )}
          {error && (
            <Typography color="error" gutterBottom>
              {error}
            </Typography>
          )}
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <TextField
              label="Nazwa użytkownika"
              name="username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <TextField
              label="Hasło"
              name="password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <TextField
              label="Imię"
              name="firstName"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <TextField
              label="Nazwisko"
              name="lastName"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <TextField
              label="E-mail"
              name="email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              label="Specjalizacja"
              name="specialization"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.specialization}
              onChange={handleChange}
              required
            />
            <TextField
              label="Doświadczenie (lata)"
              name="experience"
              type="number"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.experience}
              onChange={handleChange}
              required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: "20px" }}>
              Zarejestruj się
            </Button>
          </form>
        </Box>
      </Container>

      <Box
        component="footer"
        style={{
          backgroundColor: "#f1f1f1",
          padding: "10px 0",
          textAlign: "center",
          marginTop: "20px",
        }}
      >
        <Typography variant="body2" color="textSecondary">
          &copy; 2024 CoachingoHub. Wszelkie prawa zastrzeżone.
        </Typography>
      </Box>
    </>
  );
};

export default RegisterTrainer;
