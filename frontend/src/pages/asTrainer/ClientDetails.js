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
  Tabs,
  Tab,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import BackgroundPhoto from "../../assets/BackgroundPhotov2.png"

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [newWorkout, setNewWorkout] = useState({ description: "", date: "", notes: "" });
  const [newAppointment, setNewAppointment] = useState({ date: "", description: "", clientUsername: "" });
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [isDeleteWorkoutModalOpen, setDeleteWorkoutModalOpen] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const appointmentStatuses = ["PENDING", "COMPLETED", "CANCELLED"];




  const fetchClientDetails = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/trainers/clients/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setClient(response.data);
      setNewAppointment((prevState) => ({ ...prevState, clientUsername: response.data.username }));
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

  const fetchAppointments = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/appointments/client/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setAppointments(response.data);
    } catch (err) {
      console.error("Error fetching appointments", err);
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

  const handleAddAppointment = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/appointments",
        newAppointment,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      setNewAppointment({ date: "", description: "", clientUsername: client.username });
      fetchAppointments();
    } catch (err) {
      console.error("Error adding appointment", err);
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

  const handleUpdateAppointment = async () => {
    if (!editingAppointment) return;

    try {
      await axios.patch(
        `http://localhost:8080/api/appointments/${editingAppointment.id}`,
        {
          date: editingAppointment.date,
          description: editingAppointment.description,
          status: editingAppointment.status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      setEditingAppointment(null); // Zamknięcie formularza
      fetchAppointments(); // Odśwież listę wizyt
    } catch (err) {
      console.error("Error updating appointment", err);
    }
  };


  const handleDeleteWorkout = async () => {
    if (!workoutToDelete) return;
    try {
      await axios.delete(`http://localhost:8080/api/workouts/${workoutToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setWorkouts(workouts.filter((workout) => workout.id !== workoutToDelete));
      closeDeleteWorkoutModal();
    } catch (err) {
      console.error("Error deleting workout", err);
    }
  };

  const openDeleteWorkoutModal = (workoutId) => {
    setWorkoutToDelete(workoutId);
    setDeleteWorkoutModalOpen(true);
  };

  const closeDeleteWorkoutModal = () => {
    setWorkoutToDelete(null);
    setDeleteWorkoutModalOpen(false);
  };

  const handleDeleteAppointment = async () => {
    if (!appointmentToDelete) return;
    try {
      await axios.delete(`http://localhost:8080/api/appointments/${appointmentToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setAppointments(appointments.filter((appointment) => appointment.id !== appointmentToDelete));
      closeDeleteModal();
    } catch (err) {
      console.error("Error deleting appointment", err);
    }
  };

  const openDeleteModal = (appointmentId) => {
    setAppointmentToDelete(appointmentId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setAppointmentToDelete(null);
    setDeleteModalOpen(false);
  };

  const openEditAppointment = (appointment) => {
    setEditingAppointment({ ...appointment });
  };


  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    if (user) {
      setLoggedInUser(user);
    }
    fetchClientDetails();
    fetchWorkouts();
    fetchAppointments();
  }, [fetchClientDetails, fetchWorkouts, fetchAppointments]);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  if (!client) {
    return <Typography>Ładowanie szczegółów klienta...</Typography>;
  }

  return (
    <>
      <Box style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundImage: `url(${BackgroundPhoto})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
      }}>
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
              <Typography><strong>Telefon:</strong> {client.phoneNumber}</Typography>
              <Typography><strong>Waga:</strong> {client.weight}&nbsp;kg&nbsp;</Typography>
              <Typography><strong>Wzrost:</strong> {client.height}&nbsp;cm&nbsp;</Typography>
              <Typography><strong>Wiek:</strong> {client.age} </Typography>
            </Box>

            <Button
              variant="contained"
              style={{
                backgroundColor: "#005eff",
                marginBottom: "20px"
              }}
              onClick={() => navigate(-1)}
            >
              Powrót
            </Button>

            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Treningi" />
              <Tab label="Wizyty" />
            </Tabs>

            {tabIndex === 0 && (
              <Box mt={4}>
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
                              style={{ marginRight: "10px" }}
                            >
                              Edytuj
                            </Button>
                            <Button
                              variant="outlined"
                              color="secondary"
                              onClick={() => openDeleteWorkoutModal(workout.id)}
                            >
                              Usuń
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
            )}

            {tabIndex === 1 && (
              <Box mt={4}>
                <Typography variant="h5" gutterBottom align="center">
                  Wizyty klienta
                </Typography>
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
                      {appointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>{new Date(appointment.date).toLocaleString()}</TableCell>
                          <TableCell>{appointment.description}</TableCell>
                          <TableCell>{appointment.status}</TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() => openEditAppointment(appointment)}
                              style={{ marginRight: "10px" }}
                            >
                              Edytuj
                            </Button>

                            <Button
                              variant="outlined"
                              color="secondary"
                              onClick={() => openDeleteModal(appointment.id)}
                            >
                              Usuń
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {editingAppointment && (
                  <Box mt={4}>
                    <Typography variant="h6">Edytuj wizytę</Typography>
                    <TextField
                      label="Data"
                      type="datetime-local"
                      fullWidth
                      margin="normal"
                      value={editingAppointment.date}
                      onChange={(e) =>
                        setEditingAppointment({ ...editingAppointment, date: e.target.value })
                      }
                    />
                    <TextField
                      label="Opis"
                      fullWidth
                      margin="normal"
                      value={editingAppointment.description}
                      onChange={(e) =>
                        setEditingAppointment({ ...editingAppointment, description: e.target.value })
                      }
                    />
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={editingAppointment.status}
                        onChange={(e) =>
                          setEditingAppointment({ ...editingAppointment, status: e.target.value })
                        }
                      >
                        {appointmentStatuses.map((status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Box mt={2} display="flex" justifyContent="space-between">
                      <Button variant="contained" color="primary" onClick={handleUpdateAppointment}>
                        Zapisz
                      </Button>
                      <Button variant="contained" color="secondary" onClick={() => setEditingAppointment(null)}>
                        Anuluj
                      </Button>
                    </Box>
                  </Box>
                )}


                <Box mt={4}>
                  <Typography variant="h5" gutterBottom>
                    Umów nową wizytę
                  </Typography>
                  <TextField
                    label="Data"
                    type="datetime-local"
                    fullWidth
                    margin="normal"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                  />
                  <TextField
                    label="Opis"
                    fullWidth
                    margin="normal"
                    value={newAppointment.description}
                    onChange={(e) => setNewAppointment({ ...newAppointment, description: e.target.value })}
                  />
                  <Button variant="contained" color="primary" onClick={handleAddAppointment}>
                    Dodaj wizytę
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Container>

        {isDeleteModalOpen && (
          <>
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
              }}
            >
              <Typography variant="h6" gutterBottom>
                Czy na pewno chcesz usunąć tę wizytę?
              </Typography>
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleDeleteAppointment}
                >
                  Tak
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={closeDeleteModal}
                >
                  Nie
                </Button>
              </Box>
            </Box>
            <Box
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 999,
              }}
              onClick={closeDeleteModal}
            />
          </>
        )}

        {isDeleteWorkoutModalOpen && (
          <>
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
              }}
            >
              <Typography variant="h6" gutterBottom>
                Czy na pewno chcesz usunąć ten trening?
              </Typography>
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleDeleteWorkout}
                >
                  Tak
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={closeDeleteWorkoutModal}
                >
                  Nie
                </Button>
              </Box>
            </Box>
            <Box
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 999,
              }}
              onClick={closeDeleteWorkoutModal}
            />
          </>
        )}

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
            &copy; 2025 CoachingoHub, Jakub Fałek. Wszelkie prawa zastrzeżone.
          </Typography>
        </Box>
      </Box>
    </>

  );
};

export default ClientDetails;
