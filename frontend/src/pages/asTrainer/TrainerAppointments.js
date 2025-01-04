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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  TextField,
  Modal
} from "@mui/material";
import axios from "axios";

const TrainerAppointments = ({ trainerInfo }) => {
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState(""); // Do filtrowania wizyt po statusie
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null); // Dla szczegółów wizyty
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);

  // Pobranie wizyt trenera
  const fetchAppointments = async () => {
    try {
      console.log("Fetching appointments for trainer ID:", trainerInfo.id);
      const response = await axios.get(
        `http://localhost:8080/api/appointments/trainer/${trainerInfo.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      console.log("Appointments fetched:", response.data);
      setAppointments(response.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  useEffect(() => {
    if (trainerInfo?.id) {
      console.log("Trainer ID:", trainerInfo.id); // Sprawdź, czy trainerInfo.id jest poprawny
      fetchAppointments();
    } else {
      console.log("TrainerInfo is missing or invalid:", trainerInfo);
    }
  }, [trainerInfo]);

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
      fetchAppointments(); // Odśwież listę wizyt
    } catch (err) {
      console.error("Error updating appointment status", err);
    }
  };

  const handleEditAppointment = async () => {
    try {
      await axios.patch(
        `http://localhost:8080/api/appointments/${appointmentToEdit.id}`,
        {
          date: appointmentToEdit.date,
          description: appointmentToEdit.description,
          status: appointmentToEdit.status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      fetchAppointments(); // Odświeżenie listy wizyt
      closeEditModal();
    } catch (err) {
      console.error("Error editing appointment:", err);
    }
  };

  const openDetailsModal = (appointment) => {
    setSelectedAppointment(appointment);
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setSelectedAppointment(null);
    setDetailsModalOpen(false);
  };

  const openEditModal = (appointment) => {
    setAppointmentToEdit(appointment);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setAppointmentToEdit(null);
    setEditModalOpen(false);
  };

  // Filtrowanie wizyt po statusie i sortowanie w kolejności chronologicznej
  const filteredAppointments = [...appointments]
    .filter((appointment) =>
      statusFilter ? appointment.status === statusFilter : true
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <Box>
      <Typography variant="h5" gutterBottom align="center">
        Zarządzanie wizytami
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Filtruj według statusu</InputLabel>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <MenuItem value="">Wszystkie</MenuItem>
          <MenuItem value="PENDING">Nieodbyte</MenuItem>
          <MenuItem value="COMPLETED">Odbyte</MenuItem>
          <MenuItem value="CANCELLED">Anulowane</MenuItem>
        </Select>
      </FormControl>

      <Box mt={4} mb={8}>
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
                      color="success"
                      onClick={() =>
                        handleStatusChange(appointment.id, "COMPLETED")
                      }
                      style={{ marginRight: "10px" }}
                    >
                      Odbyty
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() =>
                        handleStatusChange(appointment.id, "PENDING")
                      }
                      style={{ marginRight: "10px" }}
                    >
                      nieodbyty
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() =>
                        handleStatusChange(appointment.id, "CANCELLED")
                      }
                      style={{ marginRight: "20px" }}
                    >
                      Anulowany
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => openEditModal(appointment)}
                    >
                      Edytuj
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => openDetailsModal(appointment)}
                      style={{ marginTop: "10px"}}
                    >     
                      Szczegóły
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {isEditModalOpen && (
        <Box
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            maxWidth: "400px",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Edytuj wizytę
          </Typography>
          <TextField
            label="Data"
            type="datetime-local"
            fullWidth
            margin="normal"
            value={appointmentToEdit?.date || ""}
            onChange={(e) =>
              setAppointmentToEdit({ ...appointmentToEdit, date: e.target.value })
            }
          />
          <TextField
            label="Opis"
            fullWidth
            margin="normal"
            value={appointmentToEdit?.description || ""}
            onChange={(e) =>
              setAppointmentToEdit({
                ...appointmentToEdit,
                description: e.target.value,
              })
            }
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "20px" }}
            onClick={handleEditAppointment}
          >
            Zapisz zmiany
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            style={{ marginTop: "10px" }}
            onClick={closeEditModal}
          >
            Anuluj
          </Button>
        </Box>
      )}

      {/* Modal szczegółów wizyty */}
      <Modal open={isDetailsModalOpen} onClose={closeDetailsModal}>
        <Box
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            maxWidth: "400px",
            textAlign: "center",
          }}
        >
          {selectedAppointment && (
            <>
              <Typography variant="h6" gutterBottom>
                Szczegóły wizyty
              </Typography>
              <Typography>
                <strong>Klient:</strong> {selectedAppointment.clientUsername || "Nieznany"}
              </Typography>
              <Typography>
                <strong>Data:</strong> {new Date(selectedAppointment.date).toLocaleString()}
              </Typography>
              <Typography>
                <strong>Status:</strong> {selectedAppointment.status}
              </Typography>
              <Typography>
                <strong>Opis:</strong> {selectedAppointment.description || "Brak opisu"}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={closeDetailsModal}
                style={{ marginTop: "20px" }}
              >
                Zamknij
              </Button>
            </>
          )}
        </Box>
      </Modal>

    </Box>

  );
};

export default TrainerAppointments;
