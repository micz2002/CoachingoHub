import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Tabs, Tab, Container } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ClientWorkouts from "./ClientWorkouts";
import ClientAppointments from "./ClientAppointments";
import AccountManager from "./AccountManager";
import ClientReports from "./ClientReports";

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
          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              Witaj w panelu klienta, {loggedInUser}!
            </Typography>
            {trainerInfo ? (
              <Box
                style={{
                  padding: "20px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  textAlign: "center",
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
        return <AccountManager />;

      default:
        return <Typography>Nieznana zakładka</Typography>;
    }
  };

  return (
    <Box style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static" style={{ backgroundColor: "#0073e6" }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            CoachingoHub - Panel Klienta
          </Typography>
          <Typography variant="body1" style={{ marginRight: "20px" }}>
            Zalogowany: {loggedInUser}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
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
            textColor="primary"
            centered
          >
            <Tab label="Dashboard" />
            <Tab label="Treningi" />
            <Tab label="Harmonogram spotkań" />
            <Tab label="Raporty" />
            <Tab label="Zarządzanie kontem" />

          </Tabs>
        </Box>

        <Box mt={4}>{renderTabContent()}</Box>
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
          &copy; 2024 CoachingoHub, Jakub Fałek. Wszelkie prawa zastrzeżone.
        </Typography>
      </Box>
    </Box>
  );
};

export default ClientDashboard;
