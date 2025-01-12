import React, { useState, useEffect } from "react";
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
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";

const ClientWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [error, setError] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // Sortowanie rosnąco/malejąco
  const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" }); // Zakres dat

  const fetchWorkouts = async () => {
    try {
      const loggedInUsername = localStorage.getItem("loggedInUser");
      const clientResponse = await axios.get(
        `http://localhost:8080/api/users/${loggedInUsername}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      const clientId = clientResponse.data.id;
      const workoutsResponse = await axios.get(
        `http://localhost:8080/api/workouts/client/${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      setWorkouts(workoutsResponse.data);
      setFilteredWorkouts(workoutsResponse.data); // Ustawienie początkowego widoku
    } catch (err) {
      console.error("Error fetching workouts:", err);
      setError("Nie udało się pobrać treningów. Spróbuj ponownie.");
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleSort = () => {
    const sortedWorkouts = [...filteredWorkouts].sort((a, b) => {
      if (sortOrder === "asc") {
        return new Date(a.date) - new Date(b.date);
      } else {
        return new Date(b.date) - new Date(a.date);
      }
    });

    setFilteredWorkouts(sortedWorkouts);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleFilter = () => {
    const filtered = workouts.filter((workout) => {
      const workoutDate = new Date(workout.date);
      const startDate = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
      const endDate = dateFilter.endDate ? new Date(dateFilter.endDate) : null;

      return (
        (!startDate || workoutDate >= startDate) &&
        (!endDate || workoutDate <= endDate)
      );
    });

    setFilteredWorkouts(filtered);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom align="center">
        Twoje treningi
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      {/* Sekcja sortowania i filtrowania */}
      <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
        <Button variant="contained" onClick={handleSort}>
          Sortuj według daty ({sortOrder === "asc" ? "rosnąco" : "malejąco"})
        </Button>
        <Box display="flex" gap={2}>
          <TextField
            label="Data początkowa"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={dateFilter.startDate}
            onChange={(e) =>
              setDateFilter({ ...dateFilter, startDate: e.target.value })
            }
          />
          <TextField
            label="Data końcowa"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={dateFilter.endDate}
            onChange={(e) =>
              setDateFilter({ ...dateFilter, endDate: e.target.value })
            }
          />
          <Button variant="contained" onClick={handleFilter}>
            Filtruj
          </Button>
        </Box>
      </Box>

      {/* Tabela treningów */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead style={{ backgroundColor: "#0073e6" }}>
            <TableRow>
              <TableCell style={{ color: "white" }}>Data</TableCell>
              <TableCell style={{ color: "white" }}>Opis</TableCell>
              <TableCell style={{ color: "white" }}>Notatki</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredWorkouts.map((workout) => (
              <TableRow key={workout.id}>
                <TableCell>{new Date(workout.date).toLocaleString()}</TableCell>
                <TableCell>{workout.description}</TableCell>
                <TableCell>{workout.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ClientWorkouts;
