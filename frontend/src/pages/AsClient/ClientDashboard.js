import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Tabs, Tab, Container } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ClientWorkouts from "./ClientWorkouts";
import ClientAppointments from "./ClientAppointments";
import ClientAccountManager from "./ClientAccountManager";
import ClientReports from "./ClientReports";
import BackgroundPhoto from "../../assets/BackgroundPhotov2.png";

const ClientDashboard = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [loggedInUser, setLoggedInUser] = useState("");
  const [trainerInfo, setTrainerInfo] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const fetchTrainerInfo = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/clients/trainers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setTrainerInfo(response.data);
    } catch (err) {
      console.error("Error fetching trainer info", err);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    if (user) {
      setLoggedInUser(user);
    }
    fetchTrainerInfo();
  }, []);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const renderTabContent = () => {
    switch (tabIndex) {
      case 0:
        return (
          <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
            <Typography variant="h5" gutterBottom
              style={{
                marginTop: "20px",
                fontWeight: "bold",
                textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)",

              }}>
              Witaj w panelu klienta, {loggedInUser}!
            </Typography>
            {trainerInfo ? (
              <Box
                style={{
                  padding: "20px",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.9)",
                  textAlign: "center",
                  width: "30%",
                  marginRight: "20px",
                  marginTop: "10px",
                  height: "100%",
                  textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)",
                }}
              >
                <Typography variant="h6" style={{ fontWeight: "bold" }}>
                  Twój trener:
                </Typography>
                <Typography variant="body1">
                  <strong>Imię i nazwisko:</strong> {trainerInfo.firstName} {trainerInfo.lastName}
                </Typography>
                <Typography variant="body1">
                  <strong>Specjalizacja:</strong> {trainerInfo.specialization}
                </Typography>
                <Typography variant="body1">
                  <strong>Doświadczenie:</strong> {trainerInfo.experience} lat
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {trainerInfo.email}
                </Typography>
                <Typography variant="body1">
                  <strong>Numer telefonu:</strong> {trainerInfo.phoneNumber}
                </Typography>
              </Box>
            ) : (
              <Typography color="error">Nie przypisano jeszcze trenera.</Typography>
            )}
          </Box>
        );
      case 1:
        return <ClientWorkouts />;
      case 2:
        return <ClientAppointments />;
      case 3:
        return <ClientReports />;
      case 4:
        return <ClientAccountManager />;

      default:
        return <Typography>Nieznana zakładka</Typography>;
    }
  };

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundImage: `url(${BackgroundPhoto})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        color: "white",
      }}
    >
      <AppBar
        position="static"
        style={{
          backgroundColor: "rgba(52, 77, 62, 0.6)",
          boxShadow: "none",
        }}
      >      <Toolbar>
          <Typography variant="h6" style={{
            flexGrow: 1, textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)",
          }}>
            CoachingoHub - Panel Klienta
          </Typography>
          <Typography variant="body1" style={{ marginRight: "20px" }}>
            Zalogowany: {loggedInUser}
          </Typography>
          <Button color="inherit"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "20px",
              padding: "5px 20px",
              textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)",
            }} onClick={handleLogout}>
            Wyloguj się
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Box mt={4}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="inherit"
            centered
            style={{
              color: "white",
              background: "rgba(53, 58, 54, 0.65)",
              margin: "auto auto auto auto",
              borderRadius: "20px"
            }}
            TabIndicatorProps={{
              style: {
                backgroundColor: "white", // White indicator for tabs
              },
            }}
          >
            {["Dashboard", "Treningi", "Harmonogram spotkań", "Raporty", "Zarządzanie kontem"].map(
              (label, index) => (
                <Tab
                  key={index}
                  label={label}
                  sx={{
                    textShadow:
                      tabIndex === index
                        ? "0px 3px 5px rgba(0, 0, 0, 0.8)" // Cień dla aktywnej zakładki
                        : "0px 3px 5px rgba(255, 255, 255, 0.8)",
                    color: "white",
                  }}
                />
              )
            )}

          </Tabs>
        </Box>

        <Box mt={4}>{renderTabContent()}</Box>
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
  );
};

export default ClientDashboard;
