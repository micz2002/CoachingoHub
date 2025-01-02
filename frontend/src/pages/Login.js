import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Container, Typography, Box, AppBar, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:8080/api/login", {
        username,
        password,
      });

      const token = response.data.token;
      localStorage.setItem("jwtToken", token);

      // Dekodowanie tokena JWT
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role; // Zakładamy, że `role` znajduje się w payloadzie JWT
      localStorage.setItem("userRole", userRole);

      console.log("Zalogowany użytkownik ma rolę:", userRole); // Debugowanie roli

      // Przekierowanie w zależności od roli
      if (userRole === "ROLE_TRAINER") {
        navigate("/dashboard-trainer");
      } else if (userRole === "ROLE_CLIENT") {
        navigate("/dashboard-client");
      } else {
        alert("Nieznana rola użytkownika");
      }
    } catch (err) {
      setError("Nieprawidłowa nazwa użytkownika lub hasło.");
      console.error("Login error", err);
    }
  };

  return (
    <>
      <AppBar position="static" style={{ backgroundColor: "#0073e6" }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, color: "white" }}>
            CoachingoHub
          </Typography>
          <Button color="inherit" style={{ marginRight: "10px" }} onClick={() => navigate("/register")}> 
            Zarejestruj się
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Container maxWidth="sm" style={{ flexGrow: 1 }}>
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
          <Typography variant="h4" gutterBottom>Logowanie</Typography>
          {error && <Typography color="error">{error}</Typography>}
          <form onSubmit={handleLogin}>
            <TextField
              label="Nazwa użytkownika"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Hasło"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Zaloguj się
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
            marginTop: "auto",
          }}
        >
          <Typography variant="body2" color="textSecondary">
            &copy; 2024 CoachingoHub. Wszelkie prawa zastrzeżone.
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default Login;
