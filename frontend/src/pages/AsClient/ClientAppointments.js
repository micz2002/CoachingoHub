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
      

      {error && <Typography color="error">{error}</Typography>}

      {/* Sekcja sortowania i filtrowania */}
      <Box display="flex" justifyContent="space-between" mt={2} mb={2}
      style={{  padding: "20px"}}>
        <Button variant="contained" onClick={handleSort} 
        style={{
          padding: "5px 15px",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.9)",
          textAlign: "center",
          marginRight: "20px",
          color: "white",
          border: "1px solid white",
        }}>
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
            style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: "5px",
              textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)"}}
              sx={{
                "& .MuiInputBase-input": {
                  color: "white", // Kolor tekstu
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)", // Kolor etykiety
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.7)", // Kolor obramowania
                  },
                  "&:hover fieldset": {
                    borderColor: "white", // Kolor obramowania po najechaniu
                  },
                },
              }}
          />
          <TextField
            label="Data końcowa"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={dateFilter.endDate}
            onChange={(e) =>
              setDateFilter({ ...dateFilter, endDate: e.target.value })
            }
            style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: "5px",
              textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)"}}
              sx={{
                "& .MuiInputBase-input": {
                  color: "white", // Kolor tekstu
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)", // Kolor etykiety
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.7)", // Kolor obramowania
                  },
                  "&:hover fieldset": {
                    borderColor: "white", // Kolor obramowania po najechaniu
                  },
                },
              }}
          />
          <FormControl>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
           
              style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: "5px",
                textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)",
                minWidth: 120}}
                sx={{
                  color: "white", // Kolor tekstu w Select
                  "& .MuiSelect-icon": {
                    color: "white", // Kolor ikony rozwijanej strzałki
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.7)", // Kolor obramowania
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white", // Kolor obramowania po najechaniu
                  },
                }}
            >
              <MenuItem value="">Wszystkie</MenuItem>
              <MenuItem value="PENDING">Nieodbyte</MenuItem>
              <MenuItem value="COMPLETED">Odbyte</MenuItem>
              <MenuItem value="CANCELLED">Anulowane</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleFilter}
          style={{
            padding: "5px 15px",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.9)",
            textAlign: "center",
            marginRight: "20px",
            color: "white",
            border: "1px solid white",
          }}>
            Filtruj
          </Button>
        </Box>
      </Box>

      {/* Tabela wizyt */}
      <TableContainer  style={{
        padding: "20px",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.9)",
        textAlign: "center",
        width: "1oo%",
        marginRight: "20px",
        height: "100%",
        textShadow: "0px 3px 10px rgba(255, 255, 255, 0.5)",
      }} component={Paper}>
        <Table>
          <TableHead >
            <TableRow style={{ backgroundColor: "rgba(104, 125, 112, 0.7)", }}>
              <TableCell style={{
                color: "white",
                textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)",
              }}>Data</TableCell>
              <TableCell style={{
                color: "white",
                textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)",
              }}>Opis</TableCell>
              <TableCell style={{
                color: "white",
                textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)",
              }}>Status</TableCell>
              <TableCell style={{
                color: "white",
                textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)",
              }}>Akcje</TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ backgroundColor: "rgba(60, 75, 66, 0.7)", }}>
            {filteredAppointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell style={{ color: "white" }}>{new Date(appointment.date).toLocaleString()}</TableCell >
                <TableCell style={{ color: "white" }}>{appointment.description}</TableCell>
                <TableCell style={{ color: "white" }}>{appointment.status}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleStatusChange(appointment.id, "CANCELLED")}
                    style={{
                      padding: "5px 15px",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      borderRadius: "10px",
                      boxShadow: "0px 4px 10px rgba(69, 8, 96, 0.48)",
                      textAlign: "center",
                      marginRight: "10px",
                      color: "purple",
                      border: "1px solid purple",
                    }}
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
