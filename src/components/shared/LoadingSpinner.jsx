import React from "react";
import { CircularProgress, Box } from "@mui/material";

const neumorphismStyles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100%",
    background: "#e0e0e0",
    boxShadow: "inset 8px 8px 16px #bebebe, inset -8px -8px 16px #ffffff",
  },
  spinnerBox: {
    width: "80px",
    height: "80px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#e0e0e0",
    borderRadius: "50%",
    boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
  },
  spinner: {
    color: "#6c6c6c",
    animation: "spinner-animation 1.5s linear infinite",
  },
};

const LoadingSpinner = () => (
  <Box sx={neumorphismStyles.container}>
    <Box sx={neumorphismStyles.spinnerBox}>
      <CircularProgress sx={neumorphismStyles.spinner} size={50} thickness={5} />
    </Box>
  </Box>
);

export default LoadingSpinner;
