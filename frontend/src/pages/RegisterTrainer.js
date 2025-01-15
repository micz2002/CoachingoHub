import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Container, Typography, Box, AppBar, Toolbar } from "@mui/material";
import BackgroundLoginPhoto from "../assets/BackgroundLogin.png"


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
            <Button
              color="inherit"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: "20px",
                padding: "5px 20px",
                textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)",
              }}
              href="/"
            >
              Zaloguj się
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
              marginBottom: "20px",
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
              Rejestracja Trenera
            </Typography>
            {success && (
              <Typography
                style={{
                  color: "#7DFF90",
                  textShadow: "0px 3px 10px rgba(0, 0, 0, 0.8)",
                }}
                gutterBottom
              >
                Rejestracja przebiegła pomyślnie! Czekaj na zatwierdzenie konta
                przez administratora (do 24h).
              </Typography>
            )}
            {error && (
              <Typography
                style={{
                  color: "#FF7373",
                  textShadow: "0px 3px 10px rgba(0, 0, 0, 0.8)",
                }}
                gutterBottom
              >
                {error}
              </Typography>
            )}
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              {[
                { label: "Nazwa użytkownika", name: "username" },
                { label: "Hasło", name: "password", type: "password" },
                { label: "Imię", name: "firstName" },
                { label: "Nazwisko", name: "lastName" },
                { label: "E-mail", name: "email", type: "email" },
                { label: "Specjalizacja", name: "specialization" },
                { label: "Doświadczenie (lata)", name: "experience", type: "number" },
              ].map((field) => (
                <TextField
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  type={field.type || "text"}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formData[field.name]}
                  onChange={handleChange}
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
              ))}
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
                Zarejestruj się
              </Button>
            </form>
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
          <Typography
            variant="body2"
            color="textSecondary"
            style={{ color: "rgba(255, 255, 255, 0.7)" }}
          >
            &copy; 2024 CoachingoHub, Jakub Fałek. Wszelkie prawa zastrzeżone.
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default RegisterTrainer;
