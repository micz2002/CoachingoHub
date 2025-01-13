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

const TrainerReports = () => {
  const [reports, setReports] = useState([]);
  const [newReport, setNewReport] = useState({
    clientFirstName: "",
    clientLastName: "",
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

      const trainerResponse = await axios.get(
        `http://localhost:8080/api/users/${loggedInUsername}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      console.log("Client Details Response:", trainerResponse.data);

      const trainerId = trainerResponse.data.id;
      console.log("Fetching reports for client ID:", trainerId);

      const reportsResponse = await axios.get(
        `http://localhost:8080/api/reports/trainer/${trainerId}`,
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

  // Pobieranie raportu jako DOCX
  const handleDownloadReport = async (reportId, reportTitle, clientFirstName, clientLastName) => {
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
      // Generowanie unikalnej nazwy pliku
      const fileName = `${clientFirstName}_${clientLastName}_${reportTitle || "Raport"}_${new Date().toISOString().split("T")[0]}.docx`;

      // Tworzenie pliku do pobrania
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      console.log("Report downloaded successfully with filename:", fileName);
    } catch (err) {
      console.error("Error downloading report:", err);
    }
  };

  return (

    <Box>
      <Typography variant="h5" gutterBottom align="center">
        Lista Raportów
      </Typography>

      {message && <Typography color="primary">{message}</Typography>}

     
      {/* Lista raportów */}
      <Typography variant="h6">Twoje Raporty</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Imię i nazwisko</TableCell>  
              <TableCell>Tytuł</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Akcja</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(reports) && reports.length > 0 ? (
              reports.map((report) => (
                <TableRow key={report.id}>
                   <TableCell>{report.clientFirstName} {report.clientLastName}</TableCell>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>{new Date(report.dateFilled).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleDownloadReport(report.id, report.title, report.clientFirstName, report.clientLastName)}
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

export default TrainerReports;
