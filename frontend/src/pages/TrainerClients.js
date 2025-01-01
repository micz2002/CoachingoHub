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

const TrainerClients = () => {
  const [clients, setClients] = useState([]);
  const [open, setOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber:"",
    age: "",
    weight: "",
    height: "",
  });

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/trainers/clients", {
        headers: {
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

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Lista klientów
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen} style={{ marginBottom: "20px" }}>
        Dodaj klienta
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nazwa użytkownika</TableCell>
              <TableCell>Imię</TableCell>
              <TableCell>Nazwisko</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Wiek</TableCell>
              <TableCell>Waga (kg)</TableCell>
              <TableCell>Wzrost (cm)</TableCell>
              <TableCell>Akcje</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.username}</TableCell>
                <TableCell>{client.firstName}</TableCell>
                <TableCell>{client.lastName}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.age}</TableCell>
                <TableCell>{client.weight}</TableCell>
                <TableCell>{client.height}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => alert(`Zarządzaj klientem: ${client.firstName} ${client.lastName}`)}
                  >
                    Zarządzaj
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
            Dodaj nowego klienta
          </Typography>
          <form>
            <TextField
              label="Nazwa użytkownika"
              name="username"
              fullWidth
              margin="normal"
              value={newClient.username}
              onChange={handleInputChange}
            />
            <TextField
              label="Hasło"
              name="password"
              type="tel"
              fullWidth
              margin="normal"
              value={newClient.password}
              onChange={handleInputChange}
            />
            <TextField
              label="Imię"
              name="firstName"
              fullWidth
              margin="normal"
              value={newClient.firstName}
              onChange={handleInputChange}
            />
            <TextField
              label="Nazwisko"
              name="lastName"
              fullWidth
              margin="normal"
              value={newClient.lastName}
              onChange={handleInputChange}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              margin="normal"
              value={newClient.email}
              onChange={handleInputChange}
            />
            <TextField
              label="Phone Number"
              name="phoneNumber"
              type="phoneNumber"
              fullWidth
              margin="normal"
              value={newClient.phoneNumber}
              onChange={handleInputChange}
            />
            <TextField
              label="Wiek"
              name="age"
              type="number"
              fullWidth
              margin="normal"
              value={newClient.age}
              onChange={handleInputChange}
            />
            <TextField
              label="Waga (kg)"
              name="weight"
              type="number"
              fullWidth
              margin="normal"
              value={newClient.weight}
              onChange={handleInputChange}
            />
            <TextField
              label="Wzrost (cm)"
              name="height"
              type="number"
              fullWidth
              margin="normal"
              value={newClient.height}
              onChange={handleInputChange}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleAddClient}
              style={{ marginTop: "20px" }}
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
