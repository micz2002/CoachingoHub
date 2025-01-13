import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";

const ClientReports = () => {
  const [reports, setReports] = useState([]);
  const [newReport, setNewReport] = useState({
    title: "",
    dateFilled: "",
    weightMeasurement: "",
    waistMeasurement: "",
    chestMeasurement: "",
    leftBicepMeasurement: "",
    rightBicepMeasurement: "",
    leftForearmMeasurement: "",
    rightForearmMeasurement: "",
    leftThighMeasurement: "",
    rightThighMeasurement: "",
    leftCalfMeasurement: "",
    rightCalfMeasurement: "",
    weeklyWorkouts: "",
    weeklyCardio: "",
    trainingProgress: "",
    sleepQuality: "",
    dietAdherence: "",
    additionalNotes: "",
  });
  const [message, setMessage] = useState("");

  // Pobieranie raportów klienta
  const fetchReports = async () => {
    try {
      const loggedInUsername = localStorage.getItem("loggedInUser");
      console.log("Fetching client details for username:", loggedInUsername);

      const clientResponse = await axios.get(
        `http://localhost:8080/api/users/${loggedInUsername}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      console.log("Client Details Response:", clientResponse.data);

      const clientId = clientResponse.data.id;
      console.log("Fetching reports for client ID:", clientId);

      const reportsResponse = await axios.get(
        `http://localhost:8080/api/reports/client/${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      console.log("Reports Response Data:", reportsResponse.data);

      // Upewnienie się, że dane są tablicą
      setReports(Array.isArray(reportsResponse.data) ? reportsResponse.data : []);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setReports([]); // W przypadku błędu ustaw pustą tablicę
    }
  };

  useEffect(() => {
    if (localStorage.getItem("jwtToken")) {
      console.log("JWT Token found, fetching reports...");
      fetchReports();
    } else {
      console.error("User is not logged in or missing token");
    }
  }, []);

  // Dodawanie nowego raportu
  const handleAddReport = async () => {
    try {
      console.log("Adding new report:", newReport);

      await axios.post("http://localhost:8080/api/reports", newReport, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setMessage("Raport został pomyślnie dodany.");
      fetchReports(); // Odśwież listę raportów
    } catch (err) {
      console.error("Error adding report:", err);
      setMessage("Nie udało się dodać raportu. Spróbuj ponownie.");
    }
  };

  // Pobieranie raportu jako DOCX
  const handleDownloadReport = async (reportId) => {
    if (!reportId) {
      console.error("Invalid report ID");
      return;
    }
  
    try {
      console.log("Downloading report with ID:", reportId);
  
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("JWT Token not found");
        return;
      }
  
      const response = await axios.get(
        `http://localhost:8080/api/reports/${reportId}/download`,
        {
          responseType: "blob", // Odpowiedź w formie binarnej
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Utworzenie pliku do pobrania
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "report.docx");
      document.body.appendChild(link);
      link.click();
      console.log("Report downloaded successfully");
    } catch (err) {
      console.error("Error downloading report:", err);
    }
  };
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom align="center">
        Zarządzanie Raportami
      </Typography>

      {message && <Typography color="primary">{message}</Typography>}

      {/* Formularz dodawania nowego raportu */}
      <Box mt={3} mb={3}>
        <Typography variant="h6">Dodaj Nowy Raport</Typography>

        {Object.keys(newReport).map((key) => {
          if (key === "dateFilled") {
            // Obsługa pola daty
            return (
              <TextField
                key={key}
                label="Data wypełnienia"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true, // Pozwala wyświetlać label przy polu daty
                }}
                value={newReport[key]}
                onChange={(e) =>
                  setNewReport({ ...newReport, [key]: e.target.value })
                }
              />
            );
          } else if (
            [
              "weightMeasurement",
              "waistMeasurement",
              "chestMeasurement",
              "leftBicepMeasurement",
              "rightBicepMeasurement",
              "leftForearmMeasurement",
              "rightForearmMeasurement",
              "leftThighMeasurement",
              "rightThighMeasurement",
              "leftCalfMeasurement",
              "rightCalfMeasurement",
            ].includes(key)
          ) {
            // Obsługa pól liczbowych
            return (
              <TextField
                key={key}
                label={key}
                type="number"
                fullWidth
                margin="normal"
                value={newReport[key]}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!isNaN(value) && Number(value) >= 0) {
                    setNewReport({ ...newReport, [key]: value });
                  }
                }}
              />
            );
          } else {
            // Obsługa pozostałych pól
            return (
              <TextField
                key={key}
                label={key}
                fullWidth
                margin="normal"
                value={newReport[key]}
                onChange={(e) =>
                  setNewReport({ ...newReport, [key]: e.target.value })
                }
              />
            );
          }
        })}


        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleAddReport}
        >
          Dodaj Raport
        </Button>
      </Box>
      {/* Lista raportów */}
      <Typography variant="h6">Twoje Raporty</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tytuł</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Akcja</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(reports) && reports.length > 0 ? (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>{new Date(report.dateFilled).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleDownloadReport(report.id)}
                    >
                      Pobierz DOCX
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Brak raportów do wyświetlenia
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ClientReports;
