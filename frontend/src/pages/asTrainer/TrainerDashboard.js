import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Tabs, Tab, Container } from "@mui/material";
import axios from "axios";
import TrainerClients from "./TrainerClients";
import { useNavigate } from "react-router-dom";
import { red } from "@mui/material/colors";
import TrainerAppointments from "./TrainerAppointments";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import WeeklyAppointmentsChart from "./WeeklyAppointmentsChart";
import TrainerAccountManager from "./TrainerAccountManager";
import TrainerReports from "./TrainerReports";
import BackgroundPhoto from "../../assets/BackgroundPhotov2.png";
import { color } from "chart.js/helpers";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  boxStyle: {
    padding: "20px",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.9)",
    textAlign: "center",
    width: "30%",
    marginRight: "20px",
    height: "100%"
  },
  boxTitle: {
    fontWeight: "bold",
    textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)",
  },
  boxValue: {
    fontWeight: "bold",
    textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)",
  },
});

const TrainerDashboard = () => {
  const styles = useStyles();
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
           
            <Box display="flex" justifyContent="space-around" mt={4}>
              <Box className={styles.boxStyle}>
                <Typography variant="h6"
                  className={styles.boxTitle}
                >Liczba klientów</Typography>
                <Typography variant="h4"
                  className={styles.boxValue}
                >{clientCount}</Typography>
              </Box>
              <Box
                className={styles.boxStyle}
              >
                <Typography variant="h6" className={styles.boxTitle} >Obecnie umówione treningi</Typography>
                <Typography variant="h4" className={styles.boxValue}>{appointmentCount}</Typography>
              </Box>
              <Box
                className={styles.boxStyle}
              >
                <Typography variant="h6" className={styles.boxTitle} >Treningi na dzisiaj</Typography>
                <Typography variant="h4" className={styles.boxValue}>{todayAppointmentCount}</Typography>
              </Box>
            </Box>
            <WeeklyAppointmentsChart />
          </>
        );

      case 1:
        return <TrainerClients />;
      case 2:
        return <TrainerAppointments trainerInfo={trainerInfo} />;
      case 3:
        return <TrainerReports />;
      case 4:
        return <TrainerAccountManager />;
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
          backgroundImage: `url(${BackgroundPhoto})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
        }}
      >
        <AppBar
          position="static"
          style={{
            backgroundColor: "rgba(52, 77, 62, 0.6)",
            boxShadow: "none",
          }}
        >
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1, textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)",
             }}>
              CoachingoHub - Panel Trenera
            </Typography>
            <Typography variant="body1" style={{ marginRight: "20px" }}>
              Zalogowany: {loggedInUser}
            </Typography>
            <Button
              color="inherit"
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
                {["Dashboard", "Lista klientów", "Harmonogram spotkań", "Raporty", "Zarządzanie kontem"].map(
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
            &copy; 2024 CoachingoHub, Jakub Fałek. Wszelkie prawa zastrzeżone.
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default TrainerDashboard;
