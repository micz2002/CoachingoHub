import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import axios from "axios";

const AccountSettings = () => {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [weight, setWeight] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdateAccount = async () => {
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
    } catch (err) {
      setMessage("Nie udało się zaktualizować konta. Spróbuj ponownie.");
    }
  };

  return (
    <Box
      style={{
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        maxWidth: "500px",
        margin: "0 auto",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Zarządzanie Kontem
      </Typography>
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
        onClick={handleUpdateAccount}
      >
        Zapisz zmiany
      </Button>
    </Box>
  );
};

export default AccountSettings;
