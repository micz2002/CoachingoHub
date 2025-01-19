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
  const fieldLabels = {
    title: "Tytuł",
    dateFilled: "Data wypełnienia",
    weightMeasurement: "Pomiar wagi (kg)",
    waistMeasurement: "Pomiar talii (cm)",
    chestMeasurement: "Pomiar klatki (cm)",
    leftBicepMeasurement: "Pomiar lewego bicepsa (cm)",
    rightBicepMeasurement: "Pomiar prawego bicepsa (cm)",
    leftForearmMeasurement: "Pomiar lewego przedramienia (cm)",
    rightForearmMeasurement: "Pomiar prawego przedramienia (cm)",
    leftThighMeasurement: "Pomiar lewego uda (cm)",
    rightThighMeasurement: "Pomiar prawego uda (cm)",
    leftCalfMeasurement: "Pomiar lewej łydki (cm)",
    rightCalfMeasurement: "Pomiar prawej łydki (cm)",
    weeklyWorkouts: "Ilość treningów w tygodniu",
    weeklyCardio: "Ilość cardio w tygodniu",
    trainingProgress: "Progres na treningach",
    sleepQuality: "Jakość snu",
    dietAdherence: "Przestrzeganie diety",
    additionalNotes: "Dodatkowe uwagi",
  };
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
  const handleDownloadReport = async (reportId, reportTitle) => {
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
      const fileName = `${reportTitle || "Raport"}_${new Date().toISOString().split("T")[0]}.docx`;

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

    <Box style={{
      display: "flex", // Ustawienie obu elementów w układzie poziomym
      flexDirection: "column", // Zmiana na kolumnowy układ
      alignItems: "center", // Wyrównanie elementów do środka
      gap: "15px", // Odstęp między formularzem a tabelą
      width: "100%",
    }}>


      {message && <Typography color="primary">{message}</Typography>}

      {/* Formularz dodawania nowego raportu */}
      <Box mt={3} mb={3}
       style={{
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.9)",
        
      }}>
        <Typography variant="h6"
        style={{ textAlign: "center",
         marginBottom: "20px",
          textShadow: "0px 3px 10px rgba(0, 0, 0, 0.8)" 
          }}
          >Dodaj Nowy Raport</Typography>


        {Object.keys(newReport).map((key) => {
          const label = fieldLabels[key] || key;

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
                
                style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: "5px",
                  textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)",
                 
                 }}
                 sx={{
                  "& .MuiInputBase-input": {
                    color: "rgba(255, 255, 255, 0.7)", // Kolor tekstu
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
                label={label}
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
                style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: "5px",
                  textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)",
              
                 }}
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
            );
          } else {
            // Obsługa pozostałych pól
            return (
              <TextField
                key={key}
                label={label}
                fullWidth
                margin="normal"
                value={newReport[key]}
                onChange={(e) =>
                  setNewReport({ ...newReport, [key]: e.target.value })
                }
                style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: "5px",
                  textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)",
                
                 }}
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
            );
          }
        })}


        <Button
          variant="contained"
        
        
          style={{
            marginTop: "20px",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          borderRadius: "20px",
          padding: "5px 20px",
          textShadow: "0px 3px 10px rgba(255, 255, 255, 0.9)",
          }}
          onClick={handleAddReport}
        >
          Dodaj Raport
        </Button>
      </Box>
      {/* Lista raportów */}
      <Typography variant="h6"
       style={{
        textAlign: "left", 
        marginLeft: "10px", 
        fontWeight: "bold", 
        color: "white", 
        textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)", 
      }}>Twoje Raporty</Typography>
      <TableContainer style={{marginBottom: "25px",
    padding: "20px",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.9)",
    display: "flex", // Ustawienie układu tabeli
    justifyContent: "center", // Wyśrodkowanie tabeli
    alignItems: "center", // Wyśrodkowanie tabeli w pionie
    width: "90%",
        textShadow: "0px 3px 10px rgba(255, 255, 255, 0.5)",
        
      }} component={Paper}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "rgba(104, 125, 112, 0.7)", }}>
              <TableCell
              style={{
                color: "white",
                textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)",
                width: "40%", // Szerokość dla Tytułu
            textAlign: "center",
              }}>Tytuł</TableCell>
              <TableCell
              style={{
                color: "white",
                textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)",
                width: "30%", // Szerokość dla Daty
            textAlign: "center",
              }}>Data</TableCell>
              <TableCell
              style={{
                color: "white",
                textShadow: "0px 3px 10px rgba(0, 0, 0, 0.9)",
                width: "30%", // Szerokość dla Akcji
                textAlign: "center",
              }}>Akcja</TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ backgroundColor: "rgba(60, 75, 66, 0.7)", }}>
            {Array.isArray(reports) && reports.length > 0 ? (
              reports.map((report) => (
                <TableRow styles key={report.id}>
                  <TableCell style={{ color: "white", textAlign: "center" }}>{report.title}</TableCell>
                  <TableCell style={{ color: "white", textAlign: "center" }}>{new Date(report.dateFilled).toLocaleDateString()}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleDownloadReport(report.id, report.title)}
                      style={{
                        padding: "5px 15px",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        borderRadius: "10px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.9)",
                        textAlign: "center",
                       
                        color: "white",
                        border: "1px solid white",
                  
                      }}
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
