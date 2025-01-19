import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Container, Typography, Box, AppBar, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import BackgroundLoginPhoto from "../assets/BackgroundLogin.png"

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
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundImage: `url(${BackgroundLoginPhoto})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
        }}>
        <AppBar position="static"
          style={{
            backgroundColor: "rgba(40, 52, 45, 0.6)",
            boxShadow: "none",
          }}>
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1, textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)",                     }}>
              CoachingoHub
            </Typography>
            <Button color="inherit" style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "20px",
              padding: "5px 20px",
              textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)",
            }} onClick={() => navigate("/register")}>
              Zarejestruj się
            </Button>
          </Toolbar>
        </AppBar>


        <Container maxWidth="sm" style={{ flexGrow: 1 }}>
          <Box
            mt={8}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.65)",
              padding: "30px",
              borderRadius: "20px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.9)",
              color: "white",
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              style={{
                textShadow: "0px 3px 10px rgba(255, 255, 255, 0.8)",
                color: "white",
                fontWeight: "bold",
              }}
            >
              Logowanie
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            <form onSubmit={handleLogin} style={{ width: "100%" }}>
              <TextField
                label="Nazwa użytkownika"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                margin="normal"
                InputProps={{
                  style: {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "5px",
                    color: "white",
                  },
                }}
                InputLabelProps={{
                  style: { color: "white" },
                }}
                style={{textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)"}}
              />
              <TextField
                label="Hasło"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                InputProps={{
                  style: {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "5px",
                    color: "white",
                    
                  },
                }}
                InputLabelProps={{
                  style: { color: "white" },
                  
                }}
                style={{textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)"}}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                style={{
                  marginTop: "20px",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  fontWeight: "bold",
                  textShadow: "0px 2px 5px rgba(0, 0, 0, 0.8)",
                }}
              >
                Zaloguj się
              </Button>
            </form>
            <Button
              onClick={() => setForgotPasswordOpen(true)}
              style={{
                marginTop: "10px",
                color: "white",
                textDecoration: "underline",
              }}
            >
              Zapomniałeś hasła?
            </Button>

            {forgotPasswordOpen && (
              <Box
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.9)",
                  zIndex: 1000,
                  maxWidth: "400px",
                  color: "white",
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  style={{ color: "white", textShadow: "0px 2px 5px rgba(0, 0, 0, 0.9)" }}
                >
                  Resetuj hasło
                </Typography>
                <TextField
                  label="Podaj swój email"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    style: {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      borderRadius: "5px",
                      color: "white",
                    },
                  }}
                  InputLabelProps={{
                    style: { color: "white" },
                  }}
                />
                <TextField
                  label="Podaj swoją nazwę użytkownika"
                  fullWidth
                  margin="normal"
                  value={resetUsername}
                  onChange={(e) => setResetUsername(e.target.value)}
                  InputProps={{
                    style: {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      borderRadius: "5px",
                      color: "white",
                    },
                  }}
                  InputLabelProps={{
                    style: { color: "white" },
                  }}
                />
                <Button
                  variant="contained"
                  fullWidth
                  style={{
                    marginTop: "20px",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    fontWeight: "bold",
                  }}
                  onClick={handleForgotPassword}
                >
                  Wyślij link resetujący
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  style={{
                    marginTop: "10px",
                    color: "white",
                    borderColor: "white",
                  }}
                  onClick={() => setForgotPasswordOpen(false)}
                >
                  Anuluj
                </Button>
              </Box>
            )}

            {linkSent && (
              <Button
                variant="contained"
                style={{
                  marginTop: "20px",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  fontWeight: "bold",
                }}
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
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: "10px 0",
            textAlign: "center",
            marginTop: "auto",
          }}
        >
          <Typography variant="body2" color="textSecondary" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
            &copy; 2025 CoachingoHub, Jakub Fałek. Wszelkie prawa zastrzeżone.
          </Typography>
        </Box>
      </Box>

    </>
  );
};

export default Login;
