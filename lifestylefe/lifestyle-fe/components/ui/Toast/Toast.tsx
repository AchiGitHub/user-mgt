import { Alert, Snackbar } from "@mui/material";
import React from "react";

interface ToastProps {
  open: boolean;
  severity: "success" | "info" | "warning" | "error";
  message: string;
  handleClose: () => void;
}

function Toast({ open, severity, message, handleClose }: ToastProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={1000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default Toast;
