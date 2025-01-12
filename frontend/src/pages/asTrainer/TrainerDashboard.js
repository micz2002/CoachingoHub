import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Tabs, Tab, Container } from "@mui/material";
import axios from "axios";
import TrainerClients from "./TrainerClients";
import { useNavigate } from "react-router-dom";
import { red } from "@mui/material/colors";
import TrainerAppointments from "./TrainerAppointments";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import WeeklyAppointmentsChart from "./WeeklyAppointmentsChart";


const TrainerDashboard = () => {
  const [trainerInfo, setTrainerInfo] = useState({ id: null, firstName: "", lastName: "", username: "" });
  const [tabIndex, setTabIndex] = useState(0);
  const [loggedInUser, setLoggedInUser] = useState("");
  const navigate = useNavigate();
  const [clientCount, setClientCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [todayAppointmentCount, setTodayAppointmentCount] = useState(0);


  const fetchTrainerInfo = async () => {
    try {
      const loggedInUsername = localStorage.getItem("loggedInUser");
      const response = await axios.get(`http://localhost:8080/api/users/${loggedInUsername}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setTrainerInfo(response.data);
      console.log("Trainer info fetched:", response.data);
    } catch (err) {
      console.error("Error fetching trainer info", err);
    }
  };

  const fetchDashboardData = async () => {
    if (!trainerInfo.id) {
      console.error("Trainer ID is null, cannot fetch dashboard data.");
      return;
    }
    try {
      const clientsResponse = await axios.get(
        "http://localhost:8080/api/trainers/clients",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      const appointmentsResponse = await axios.get(
        `http://localhost:8080/api/appointments/trainer/${trainerInfo.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      setClientCount(clientsResponse.data.length);
      setAppointmentCount(appointmentsResponse.data.length);
      // Automatyczne obliczanie liczby wizyt na dzisiaj
      calculateTodayAppointments(appointmentsResponse.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
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
    console.log("Fetching trainer info...");
    fetchTrainerInfo();
  }, []);

  useEffect(() => {
    if (trainerInfo.id) {
      console.log("Fetching dashboard data...");
      fetchDashboardData();
    }
  }, [trainerInfo]);

  useEffect(() => {
    if (trainerInfo.id) {
      const fetchAndCalculateTodayAppointments = async () => {
        try {
          const appointmentsResponse = await axios.get(
            `http://localhost:8080/api/appointments/trainer/${trainerInfo.id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
              },
            }
          );
          calculateTodayAppointments(appointmentsResponse.data);
        } catch (err) {
          console.error("Error fetching today's appointments:", err);
        }
      };
  
      fetchAndCalculateTodayAppointments();
    }
  }, [appointmentCount]);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const calculateTodayAppointments = (appointments) => {
    const today = new Date().toISOString().split("T")[0];
    const todayAppointments = appointments.filter((appointment) =>
      appointment.date.startsWith(today)
    );
    setTodayAppointmentCount(todayAppointments.length);
  };

  const renderTabContent = () => {
    switch (tabIndex) {
      case 0:
        return (
          <>
            <Typography>Dashboard - Najważniejsze informacje</Typography>
            <Box display="flex" justifyContent="space-around" mt={4}>
              <Box
                style={{
                  padding: "20px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  textAlign: "center",
                  width: "30%",
                  marginRight: "20px",
                }}
              >
                <Typography variant="h6" style={{fontWeight: "bold"}} >Liczba klientów</Typography>
                <Typography variant="h4">{clientCount}</Typography>
              </Box>
              <Box
                style={{
                  padding: "20px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  textAlign: "center",
                  width: "30%",
                  marginRight: "20px",
                }}
              >
                <Typography variant="h6" style={{fontWeight: "bold"}} >Obecnie umówione treningi</Typography>
                <Typography variant="h4">{appointmentCount}</Typography>
              </Box>
              <Box
                style={{
                  padding: "20px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  textAlign: "center",
                  width: "30%",
                }}
              >
                <Typography variant="h6" style={{fontWeight: "bold"}} >Treningi na dzisiaj</Typography>
                <Typography variant="h4">{todayAppointmentCount}</Typography>
              </Box>
            </Box>
            <WeeklyAppointmentsChart />
          </>
        );

      case 1:
        return <TrainerClients />;
      case 2:
        return <TrainerAppointments trainerInfo={trainerInfo} />;
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
              <Tab label="Harmonogram spotkań" />
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
          <Typography variant="body2" color="textSecondary" >
            &copy; 2024 CoachingoHub, Jakub Fałek. Wszelkie prawa zastrzeżone.
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default TrainerDashboard;
