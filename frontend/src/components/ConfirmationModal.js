import React from "react";
import { Box, Typography, Button } from "@mui/material";

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
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
          {message}
        </Typography>
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button variant="contained" color="primary" onClick={onConfirm}>
            Tak
          </Button>
          <Button variant="contained" color="secondary" onClick={onCancel}>
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
        onClick={onCancel}
      />
    </>
  );
};

export default ConfirmationModal;
