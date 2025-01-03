import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Tabs, Tab, Container } from "@mui/material";
import axios from "axios";
import TrainerClients from "./TrainerClients";
import TrainerWorkouts from "./TrainerWorkouts";
import { useNavigate } from "react-router-dom";
import { red } from "@mui/material/colors";

const TrainerDashboard = () => {
  const [trainerInfo, setTrainerInfo] = useState({ firstName: "", lastName: "", username: "" });
  const [tabIndex, setTabIndex] = useState(0);
  const [loggedInUser, setLoggedInUser] = useState("");
  const navigate = useNavigate();
  

  const fetchTrainerInfo = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/users/{username}", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setTrainerInfo(response.data);
    } catch (err) {
      console.error("Error fetching trainer info", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken"); // Usuń token JWT
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userRole"); // Usuń rolę użytkownika
    navigate("/"); // Przekieruj na stronę logowania
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
        return <Typography>Dashboard - Najważniejsze informacje</Typography>;
      case 1:
        return <TrainerClients />;
      case 2:
        return <TrainerWorkouts />;
      case 3:
        return <Typography>Umawianie wizyt - Tutaj można umawiać wizyty</Typography>;
      default:
        return <Typography>Nieznana zakładka</Typography>;
    }
  };

  return (
    <>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <AppBar position="static" style={{ backgroundColor: "#0073e6" }}>
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              CoachingoHub - Panel Trenera
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
              <Tab label="Lista klientów" />
              <Tab label="Treningi" />
              <Tab label="Wizyty" />
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
            &copy; 2024 CoachingoHub. Wszelkie prawa zastrzeżone.
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default TrainerDashboard;
