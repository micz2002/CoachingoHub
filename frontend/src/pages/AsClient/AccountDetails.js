import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import axios from "axios";

const AccountDetails = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedDetails, setUpdatedDetails] = useState({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchUserDetails = async () => {
    try {
      const loggedInUsername = localStorage.getItem("loggedInUser");
      const response = await axios.get(`http://localhost:8080/api/users/${loggedInUsername}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });

      setUserDetails(response.data);
      setUpdatedDetails(response.data);
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("Nie udało się pobrać informacji o koncie. Spróbuj ponownie.");
    }
  };

  const handleUpdateDetails = async () => {
    try {
      const loggedInUsername = localStorage.getItem("loggedInUser");
      await axios.patch(
        `http://localhost:8080/api/users/${loggedInUsername}`,
        updatedDetails,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      setMessage("Dane zostały pomyślnie zaktualizowane.");
      setEditMode(false);
    } catch (err) {
      console.error("Error updating user details:", err);
      setError("Nie udało się zaktualizować danych. Spróbuj ponownie.");
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

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
        Twoje Konto
      </Typography>

      {message && <Typography color="primary">{message}</Typography>}

      {!editMode ? (
        <>
          <Typography>
            <strong>Imię:</strong> {userDetails.firstName}
          </Typography>
          <Typography>
            <strong>Nazwisko:</strong> {userDetails.lastName}
          </Typography>
          <Typography>
            <strong>Email:</strong> {userDetails.email}
          </Typography>
          <Typography>
            <strong>Numer telefonu:</strong> {userDetails.phoneNumber}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "20px" }}
            onClick={() => setEditMode(true)}
          >
            Edytuj Dane
          </Button>
        </>
      ) : (
        <>
          <TextField
            label="Imię"
            fullWidth
            margin="normal"
            value={updatedDetails.firstName}
            onChange={(e) => setUpdatedDetails({ ...updatedDetails, firstName: e.target.value })}
          />
          <TextField
            label="Nazwisko"
            fullWidth
            margin="normal"
            value={updatedDetails.lastName}
            onChange={(e) => setUpdatedDetails({ ...updatedDetails, lastName: e.target.value })}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={updatedDetails.email}
            onChange={(e) => setUpdatedDetails({ ...updatedDetails, email: e.target.value })}
          />
          <TextField
            label="Numer telefonu"
            type="text"
            fullWidth
            margin="normal"
            value={updatedDetails.phoneNumber}
            onChange={(e) =>
              setUpdatedDetails({ ...updatedDetails, phoneNumber: e.target.value })
            }
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "20px" }}
            onClick={handleUpdateDetails}
          >
            Zapisz Zmiany
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            style={{ marginTop: "10px" }}
            onClick={() => setEditMode(false)}
          >
            Anuluj
          </Button>
        </>
      )}
    </Box>
  );
};

export default AccountDetails;
