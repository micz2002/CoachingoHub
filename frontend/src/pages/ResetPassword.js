import React, { useState } from "react";
import { TextField, Button, Typography, Box, AppBar, Toolbar, Container } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackgroundLoginPhoto from "../assets/BackgroundLogin.png"

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
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundImage: `url(${BackgroundLoginPhoto})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
        }}
      >
        <AppBar
          position="static"
          style={{
            backgroundColor: "rgba(40, 52, 45, 0.6)",
            boxShadow: "none",
          }}
        >
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1, textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)",                     }}>
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
            flexGrow: 1,
            padding: "20px",
          }}
        >
          <Box
            style={{
              padding: "30px",
              backgroundColor: "rgba(0, 0, 0, 0.65)",
              borderRadius: "20px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.9)",
              maxWidth: "400px",
              width: "100%",
              color: "white",
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              style={{
                textShadow: "0px 3px 10px rgba(255, 255, 255, 0.8)",
                fontWeight: "bold",
                color: "white",
                textAlign: "center",
              }}
            >
              Zresetuj hasło
            </Typography>
            {error && (
              <Typography
                style={{
                  color: "#FF7373",
                  textShadow: "0px 3px 10px rgba(0, 0, 0, 0.8)",
                  textAlign: "center",
                }}
                gutterBottom
              >
                {error}
              </Typography>
            )}
            {message && (
              <Typography
                style={{
                  color: "#7DFF90",
                  textShadow: "0px 3px 10px rgba(0, 0, 0, 0.8)",
                  textAlign: "center",
                }}
                gutterBottom
              >
                {message}
              </Typography>
            )}
            <TextField
              label="Podaj token"
              fullWidth
              margin="normal"
              value={token}
              onChange={(e) => setToken(e.target.value)}
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
              label="Nowe hasło"
              type="password"
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
                textShadow: "0px 2px 5px rgba(0, 0, 0, 0.8)",
              }}
              onClick={handleResetPassword}
            >
              Zresetuj hasło
            </Button>
          </Box>
        </Box>

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

export default ResetPassword;
