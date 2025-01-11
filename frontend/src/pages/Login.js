import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Container, Typography, Box, AppBar, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [resetUsername, setResetUsername] = useState(""); // Dodano zmienną resetUsername
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [linkSent, setLinkSent] = useState(false); // Dodano stan dla wysłania linku
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
      localStorage.setItem("loggedInUser", username); // Zapisanie nazwy użytkownika

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

  const handleForgotPassword = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/users/forgot-password",
        null,
        {
          params: { email, resetUsername }, // Dodano username do parametrów
        }
      );
      setLinkSent(true); // Ustawienie, że link został wysłany
      alert("Link do resetu hasła został wysłany na Twój email.");
      setForgotPasswordOpen(false);
    } catch (err) {
      console.error("Error sending password reset link:", err);
      alert("Nie udało się wysłać linku do resetu hasła. Spróbuj ponownie.");
    }
  };

  const handleNavigateToReset = () => {
    navigate("/reset-password"); // Przekierowanie na stronę resetu hasła
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
            <Button onClick={() => setForgotPasswordOpen(true)} color="primary" style={{ marginTop: "10px" }}>
              Zapomniałeś hasła?
            </Button>

            {/* Modal do wpisania e-maila i nazwy użytkownika */}
            {forgotPasswordOpen && (
              <Box
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  zIndex: 1000,
                  maxWidth: "400px",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Resetuj hasło
                </Typography>
                <TextField
                  label="Podaj swój email"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  label="Podaj swoją nazwę użytkownika"
                  fullWidth
                  margin="normal"
                  value={resetUsername}
                  onChange={(e) => setResetUsername(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  style={{ marginTop: "20px" }}
                  onClick={handleForgotPassword}
                >
                  Wyślij link resetujący
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  style={{ marginTop: "10px" }}
                  onClick={() => setForgotPasswordOpen(false)}
                >
                  Anuluj
                </Button>
              </Box>
            )}

            {/* Przycisk przekierowujący na stronę resetu hasła */}
            {linkSent && (
              <Button
                variant="contained"
                color="secondary"
                style={{ marginTop: "20px" }}
                onClick={handleNavigateToReset}
              >
                Przejdź do strony resetu hasła
              </Button>
            )}
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
