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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";

const ClientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [error, setError] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" });
  const [statusFilter, setStatusFilter] = useState("");

  const fetchAppointments = async () => {
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
      const appointmentsResponse = await axios.get(
        `http://localhost:8080/api/appointments/client/${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      setAppointments(appointmentsResponse.data);
      setFilteredAppointments(appointmentsResponse.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Nie udało się pobrać wizyt. Spróbuj ponownie.");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSort = () => {
    const sortedAppointments = [...filteredAppointments].sort((a, b) => {
      if (sortOrder === "asc") {
        return new Date(a.date) - new Date(b.date);
      } else {
        return new Date(b.date) - new Date(a.date);
      }
    });

    setFilteredAppointments(sortedAppointments);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleFilter = () => {
    const filtered = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      const startDate = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
      const endDate = dateFilter.endDate ? new Date(dateFilter.endDate) : null;
      const matchesStatus = statusFilter
        ? appointment.status === statusFilter
        : true;

      return (
        (!startDate || appointmentDate >= startDate) &&
        (!endDate || appointmentDate <= endDate) &&
        matchesStatus
      );
    });

    setFilteredAppointments(filtered);
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:8080/api/appointments/${appointmentId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      fetchAppointments();
    } catch (err) {
      console.error("Error updating appointment status:", err);
      setError("Nie udało się zmienić statusu wizyty.");
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom align="center">
        Twoje wizyty
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
          <FormControl>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ minWidth: 120 }}
            >
              <MenuItem value="">Wszystkie</MenuItem>
              <MenuItem value="PENDING">Nieodbyte</MenuItem>
              <MenuItem value="COMPLETED">Odbyte</MenuItem>
              <MenuItem value="CANCELLED">Anulowane</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleFilter}>
            Filtruj
          </Button>
        </Box>
      </Box>

      {/* Tabela wizyt */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead style={{ backgroundColor: "#0073e6" }}>
            <TableRow>
              <TableCell style={{ color: "white" }}>Data</TableCell>
              <TableCell style={{ color: "white" }}>Opis</TableCell>
              <TableCell style={{ color: "white" }}>Status</TableCell>
              <TableCell style={{ color: "white" }}>Akcje</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAppointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{new Date(appointment.date).toLocaleString()}</TableCell>
                <TableCell>{appointment.description}</TableCell>
                <TableCell>{appointment.status}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleStatusChange(appointment.id, "CANCELLED")}
                  >
                    Anuluj
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ClientAppointments;
