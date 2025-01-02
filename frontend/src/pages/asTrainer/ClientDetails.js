import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  AppBar,
  Toolbar,
  Container,
} from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [newWorkout, setNewWorkout] = useState({ description: "", date: "", notes: "" });
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState("");

  const fetchClientDetails = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/trainers/clients/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setClient(response.data);
    } catch (err) {
      console.error("Error fetching client details", err);
    }
  }, [id]);

  const fetchWorkouts = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/workouts/client/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setWorkouts(response.data);
    } catch (err) {
      console.error("Error fetching workouts", err);
    }
  }, [id]);

  const handleAddWorkout = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/workouts",
        {
          ...newWorkout,
          username: client.username,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      setNewWorkout({ description: "", date: "", notes: "" });
      fetchWorkouts();
    } catch (err) {
      console.error("Error adding workout", err);
    }
  };

  const handleUpdateWorkout = async (workoutId) => {
    try {
      await axios.patch(
        `http://localhost:8080/api/workouts/${workoutId}`,
        editingWorkout,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      setEditingWorkout(null);
      fetchWorkouts();
    } catch (err) {
      console.error("Error updating workout", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    if (user) {
      setLoggedInUser(user);
    }
    fetchClientDetails();
    fetchWorkouts();
  }, [fetchClientDetails, fetchWorkouts]);

  if (!client) {
    return <Typography>Ładowanie szczegółów klienta...</Typography>;
  }

  return (
    <>
      <AppBar position="static" style={{ backgroundColor: "#0073e6" }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, color: "white" }}>
            CoachingoHub
          </Typography>
          <Typography style={{ marginRight: "20px", color: "white" }}>
            Zalogowany: {loggedInUser}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Wyloguj się
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Box mt={4}>
          <Typography variant="h4" gutterBottom align="center">
            Szczegóły klienta
          </Typography>

          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "#f9f9f9",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
            mb={4}
          >
            <Typography><strong>Nazwa użytkownika:</strong> {client.username}</Typography>
            <Typography><strong>Imię:</strong> {client.firstName}</Typography>
            <Typography><strong>Nazwisko:</strong> {client.lastName}</Typography>
            <Typography><strong>Waga:</strong> {client.weight} kg</Typography>
            <Typography><strong>Wzrost:</strong> {client.height} cm</Typography>
            <Typography><strong>Wiek:</strong> {client.age} </Typography>
          </Box>

          <Button
            variant="contained"
            style={{ 
              backgroundColor: "#005eff",
              marginBottom: "20px" }}
            onClick={() => navigate(-1)}
          >
            Powrót
          </Button>

          <Typography variant="h5" gutterBottom align="center">
            Lista treningów
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead style={{ backgroundColor: "#0073e6" }}>
                <TableRow>
                  <TableCell style={{ color: "white" }}>Opis</TableCell>
                  <TableCell style={{ color: "white" }}>Data</TableCell>
                  <TableCell style={{ color: "white" }}>Notatki</TableCell>
                  <TableCell style={{ color: "white" }}>Akcje</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workouts.map((workout) => (
                  <TableRow key={workout.id}>
                    <TableCell>{workout.description}</TableCell>
                    <TableCell>{new Date(workout.date).toLocaleString()}</TableCell>
                    <TableCell>{workout.notes}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => setEditingWorkout(workout)}
                      >
                        Edytuj
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {editingWorkout && (
            <Box mt={4}>
              <Typography variant="h6">Edytuj trening</Typography>
              <TextField
                label="Opis"
                fullWidth
                margin="normal"
                value={editingWorkout.description}
                onChange={(e) => setEditingWorkout({ ...editingWorkout, description: e.target.value })}
              />
              <TextField
                label="Data"
                type="datetime-local"
                fullWidth
                margin="normal"
                value={editingWorkout.date}
                onChange={(e) => setEditingWorkout({ ...editingWorkout, date: e.target.value })}
              />
              <TextField
                label="Notatki"
                fullWidth
                margin="normal"
                value={editingWorkout.notes}
                onChange={(e) => setEditingWorkout({ ...editingWorkout, notes: e.target.value })}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleUpdateWorkout(editingWorkout.id)}
              >
                Zapisz
              </Button>
            </Box>
          )}

          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              Dodaj nowy trening
            </Typography>
            <TextField
              label="Opis"
              fullWidth
              margin="normal"
              value={newWorkout.description}
              onChange={(e) => setNewWorkout({ ...newWorkout, description: e.target.value })}
            />
            <TextField
              label="Data"
              type="datetime-local"
              fullWidth
              margin="normal"
              value={newWorkout.date}
              onChange={(e) => setNewWorkout({ ...newWorkout, date: e.target.value })}
            />
            <TextField
              label="Notatki"
              fullWidth
              margin="normal"
              value={newWorkout.notes}
              onChange={(e) => setNewWorkout({ ...newWorkout, notes: e.target.value })}
            />
            <Button variant="contained" color="primary" onClick={handleAddWorkout}>
              Dodaj trening
            </Button>
          </Box>
        </Box>
      </Container>

      <Box
        component="footer"
        style={{
          backgroundColor: "#f1f1f1",
          padding: "10px 0",
          textAlign: "center",
          marginTop: "20px",
        }}
      >
        <Typography variant="body2" color="textSecondary">
          &copy; 2024 CoachingoHub. Wszelkie prawa zastrzeżone.
        </Typography>
      </Box>
    </>
  );
};

export default ClientDetails;
