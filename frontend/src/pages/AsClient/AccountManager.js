import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Tabs, Tab } from "@mui/material";
import axios from "axios";

const AccountManager = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState("");
  const [tabIndex, setTabIndex] = useState(0); // 0: Szczegóły konta, 1: Edycja konta
  const [updatedDetails, setUpdatedDetails] = useState({});
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [weight, setWeight] = useState("");

  const fetchUserDetails = async () => {
    try {
      const loggedInUsername = localStorage.getItem("loggedInUser");
      const response = await axios.get(
        `http://localhost:8080/api/users/${loggedInUsername}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      if (response.data) {
        setUserDetails(response.data);
        setUpdatedDetails(response.data); // Wstępne dane dla edycji
      } else {
        setError("Nie udało się pobrać informacji o koncie.");
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("Nie udało się pobrać informacji o koncie. Spróbuj ponownie.");
    }
  };

  const handleUpdateDetails = async () => {
    try {
      const updates = {};
      if (email) updates.email = email;
      if (phoneNumber) updates.phoneNumber = phoneNumber;
      if (weight) updates.weight = weight;

      await axios.patch(
        "http://localhost:8080/api/users",
        updates,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      setMessage("Konto zostało pomyślnie zaktualizowane.");
      setTabIndex(0);
    } catch (err) {
      setMessage("Nie udało się zaktualizować konta. Spróbuj ponownie.");
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
    setMessage(""); // Czyszczenie komunikatu przy zmianie zakładki
    setError("");
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!userDetails) {
    return <Typography>Ładowanie danych konta...</Typography>;
  }

  return (
    <Box
      style={{
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        maxWidth: "600px",
        margin: "0 auto",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Zarządzanie Kontem
      </Typography>

      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Szczegóły konta" />
        <Tab label="Edycja konta" />
      </Tabs>

      {tabIndex === 0 && (
        <Box mt={3}>
          <Typography>
            <strong>Nazwa użytkownika:</strong> {userDetails.username}
          </Typography>
          <Typography>
            <strong>Imię:</strong> {userDetails.firstName}
          </Typography>
          <Typography>
            <strong>Nazwisko:</strong> {userDetails.lastName}
          </Typography>
          <Typography>
            <strong>Wiek:</strong> {userDetails.age}
          </Typography>
          <Typography>
            <strong>Waga:</strong> {userDetails.weight}
          </Typography>
          <Typography>
            <strong>Wzrost:</strong> {userDetails.height}
          </Typography>
          <Typography>
            <strong>Email:</strong> {userDetails.email}
          </Typography>
          <Typography>
            <strong>Numer telefonu:</strong> {userDetails.phoneNumber}
          </Typography>
        </Box>
      )}

      {tabIndex === 1 && (
        <Box mt={3}>
          {message && <Typography color="primary">{message}</Typography>}
          <TextField
            label="Nowy Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Nowy Numer Telefonu"
            fullWidth
            margin="normal"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <TextField
            label="Nowa waga ciała"
            fullWidth
            margin="normal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "20px" }}
            onClick={handleUpdateDetails}
          >
            Zapisz zmiany
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default AccountManager;
