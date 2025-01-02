import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  Modal,
  TextField,
} from "@mui/material";
import axios from "axios";

const TrainerWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [open, setOpen] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    username: "",
    description: "",
    date: "",
    notes: "",
  });

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/workouts/trainer", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setWorkouts(response.data);
    } catch (err) {
      console.error("Error fetching workouts", err);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    setNewWorkout({ ...newWorkout, [e.target.name]: e.target.value });
  };

  const handleAddWorkout = async () => {
    try {
      await axios.post("http://localhost:8080/api/workouts", newWorkout, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      handleClose();
      fetchWorkouts();
    } catch (err) {
      console.error("Error adding workout", err);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Zarządzanie treningami
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen} style={{ marginBottom: "20px" }}>
        Dodaj trening
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Klient</TableCell>
              <TableCell>Opis</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Notatki</TableCell>
              <TableCell>Akcje</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workouts.map((workout) => (
              <TableRow key={workout.id}>
                <TableCell>{workout.clientName}</TableCell>
                <TableCell>{workout.description}</TableCell>
                <TableCell>{new Date(workout.date).toLocaleString()}</TableCell>
                <TableCell>{workout.notes}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => alert(`Edytuj trening: ${workout.description}`)}
                  >
                    Edytuj
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleClose}>
        <Box
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Dodaj nowy trening
          </Typography>
          <form>
            <TextField
              label="Nazwa użytkownika"
              name="username"
              fullWidth
              margin="normal"
              value={newWorkout.username}
              onChange={handleInputChange}
              required
            />
            <TextField
              label="Opis"
              name="description"
              fullWidth
              margin="normal"
              value={newWorkout.description}
              onChange={handleInputChange}
              required
            />
            <TextField
              label="Data"
              name="date"
              type="datetime-local"
              fullWidth
              margin="normal"
              value={newWorkout.date}
              onChange={handleInputChange}
              required
            />
            <TextField
              label="Notatki"
              name="notes"
              fullWidth
              margin="normal"
              value={newWorkout.notes}
              onChange={handleInputChange}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleAddWorkout}
              style={{ marginTop: "20px" }}
            >
              Dodaj trening
            </Button>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default TrainerWorkouts;
