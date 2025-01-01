import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Container, Typography, Box, AppBar, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";

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

      const { token } = response.data;
      localStorage.setItem("jwtToken", token);
      alert("Zalogowano pomyślnie!");
      // Redirect user to the dashboard or another page
      navigate("/dashboard")
    } catch (err) {
      setError("Nieprawidłowa nazwa użytkownika lub hasło.");
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
            <Typography variant="h4" gutterBottom>
              Zaloguj się
            </Typography>
            {error && (
              <Typography color="error" gutterBottom>
                {error}
              </Typography>
            )}
            <form onSubmit={handleLogin} style={{ width: "100%" }}>
              <TextField
                label="Nazwa użytkownika"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <TextField
                label="Hasło"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: "20px" }}>
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
