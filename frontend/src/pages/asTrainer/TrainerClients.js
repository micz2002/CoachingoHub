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
import { useNavigate } from "react-router-dom";

const TrainerClients = () => {
  const [clients, setClients] = useState([]);
  const [open, setOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [newClient, setNewClient] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    age: "",
    weight: "",
    height: "",
  });

  const navigate = useNavigate();


  // Funkcja asynchroniczna do pobrania listy klientów dla zalogowanego trenera
  const fetchClients = async () => {
    try {
      // Wykonanie żądania GET do endpointu backendu odpowiedzialnego za zwrócenie listy klientów
      const response = await axios.get("http://localhost:8080/api/trainers/clients", {
        headers: {
          // Przekazanie tokena JWT w nagłówku autoryzacji, aby uwierzytelnić żądanie
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setClients(response.data);
    } catch (err) {
      console.error("Error fetching clients", err);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  const handleAddClient = async () => {
    try {
      await axios.post("http://localhost:8080/api/trainers/clients", newClient, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      handleClose();
      fetchClients();
    } catch (err) {
      console.error("Error adding client", err);
    }
  };

  const openDeleteModal = (client) => {
    setClientToDelete(client);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setClientToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDeleteClient = async () => {
    if (clientToDelete) {
      try {
        await axios.delete(`http://localhost:8080/api/trainers/clients/${clientToDelete.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
        setClients(clients.filter((client) => client.id !== clientToDelete.id)); // Usuń lokalnie
        closeDeleteModal(); // Zamknij modal po usunięciu
      } catch (err) {
        console.error("Error deleting client", err);
      }
    }
  };




  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.65)",
          borderRadius: "20px",
          padding: "5px 20px",
          textShadow: "0px 3px 10px rgba(255, 255, 255, 0.9)",
          marginBottom: "7px"
        }}
      >
        Dodaj klienta
      </Button>
      <TableContainer style={{
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
        <Table >
          <TableHead >
            <TableRow style={{ backgroundColor: "rgba(104, 125, 112, 0.7)", }} >
              <TableCell style={{
                color: "white",
                textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)",
              }}>Nazwa użytkownika</TableCell>
              <TableCell style={{
                color: "white",
                textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)",
              }}>Imię</TableCell>
              <TableCell style={{
                color: "white",
                textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)",
              }}>Nazwisko</TableCell>
              <TableCell style={{
                color: "white",
                textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)",
              }}>Email</TableCell>
              <TableCell style={{
                color: "white",
                textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)",
              }}>Akcje</TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ backgroundColor: "rgba(60, 75, 66, 0.7)", }}>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell style={{ color: "white" }}>{client.username}</TableCell>
                <TableCell style={{ color: "white" }}>{client.firstName}</TableCell>
                <TableCell style={{ color: "white" }}>{client.lastName}</TableCell>
                <TableCell style={{ color: "white" }}>{client.email}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate(`/clients/${client.id}`)}
                    style={{
                      padding: "5px 15px",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      borderRadius: "10px",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.9)",
                      textAlign: "center",
                      marginRight: "20px",
                      color: "white",
                      border: "1px solid white",
                    }}
                  >
                    Szczegóły
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => openDeleteModal(client)}
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
                    Usuń
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {isDeleteModalOpen && (
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
          <Typography variant="h6" gutterBottom
            style={{ color: "black" }}>
            Czy na pewno chcesz usunąć klienta {clientToDelete?.firstName} {clientToDelete?.lastName}?
          </Typography>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={confirmDeleteClient}
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
      )}

      <Modal open={open} onClose={handleClose}>
        <Box
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "15px", // Zmniejszony padding
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            maxWidth: "60%", // Zmniejszona szerokość
            maxHeight: "80%", // Zmniejszona wysokość
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" gutterBottom align="center">
            Dodaj nowego klienta
          </Typography>
          <form>
            <TextField
              label="Nazwa użytkownika"
              name="username"
              fullWidth
              margin="dense" // Zmniejszone odstępy między polami
              value={newClient.username}
              onChange={handleInputChange}
            />
            <TextField
              label="Hasło"
              name="password"
              type="password"
              fullWidth
              margin="dense"
              value={newClient.password}
              onChange={handleInputChange}
            />
            <TextField
              label="Imię"
              name="firstName"
              fullWidth
              margin="dense"
              value={newClient.firstName}
              onChange={handleInputChange}
            />
            <TextField
              label="Nazwisko"
              name="lastName"
              fullWidth
              margin="dense"
              value={newClient.lastName}
              onChange={handleInputChange}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              margin="dense"
              value={newClient.email}
              onChange={handleInputChange}
            />
            <TextField
              label="Phone Number"
              name="phoneNumber"
              type="text"
              fullWidth
              margin="dense"
              value={newClient.phoneNumber}
              onChange={handleInputChange}
            />
            <TextField
              label="Wiek"
              name="age"
              type="number"
              fullWidth
              margin="dense"
              value={newClient.age}
              onChange={handleInputChange}
            />
            <TextField
              label="Waga (kg)"
              name="weight"
              type="number"
              fullWidth
              margin="dense"
              value={newClient.weight}
              onChange={handleInputChange}
            />
            <TextField
              label="Wzrost (cm)"
              name="height"
              type="number"
              fullWidth
              margin="dense"
              value={newClient.height}
              onChange={handleInputChange}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleAddClient}
              style={{
                marginTop: "15px", // Zmniejszony odstęp
                padding: "10px", // Zmniejszony padding przycisku
              }}
            >
              Dodaj klienta
            </Button>
          </form>
        </Box>
      </Modal>

    </Box>

  );
};

export default TrainerClients;
