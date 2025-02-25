import React from "react";
import { AppBar, Toolbar, Typography, Container, Box, IconButton, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate, useLocation } from "react-router-dom";
import NDRF from "../../assets/ndrf_logo.png";
import { useAuth } from "../../context/AuthContext";

const neumorphismStyles = {
  appBar: {
    background: "#e0e0e0",
    boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
    borderRadius: "12px",
    padding: "8px 16px",
    margin: "8px",
  },
  iconButton: {
    background: "#e0e0e0",
    boxShadow: "4px 4px 8px #bebebe, -4px -4px 8px #ffffff",
    borderRadius: "50%",
    padding: "8px",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
    },
  },
  logoBox: {
    background: "#e0e0e0",
    boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    marginRight: "8px",
  },
  container: {
    background: "#e0e0e0",
    boxShadow: "inset 6px 6px 12px #bebebe, inset -6px -6px 12px #ffffff",
    borderRadius: "12px",
    padding: "16px",
    marginTop: "12px",
  },
  title: {
    fontWeight: "bold",
    color: "#555",
    textShadow: "1px 1px 2px #bebebe",
    flexGrow: 1, // Makes title push other elements to the right
  },
  subtitle: {
    fontStyle: "italic",
    color: "#777",
    textShadow: "1px 1px 2px #bebebe",
  },
  logoutButton: {
    background: "#e0e0e0",
    boxShadow: "4px 4px 8px #bebebe, -4px -4px 8px #ffffff",
    borderRadius: "12px",
    padding: "6px 12px",
    fontSize: "0.575rem",
    marginLeft: "12px",
    "&:hover": {
      background: "#d1d9e6",
    },
  },
};

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const showBackButton = location.pathname !== "/employee" && location.pathname !== "/admin";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <AppBar position="static" sx={neumorphismStyles.appBar}>
        <Toolbar>
          {showBackButton && user?.role === "admin" && (
            <IconButton onClick={() => navigate(-1)} sx={{ mr: 2, ...neumorphismStyles.iconButton }}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Box sx={neumorphismStyles.logoBox}>
            <img src={NDRF} alt="Logo" style={{ width: 30, height: 30, objectFit: "contain" }} />
          </Box>
          <Typography variant="h6" sx={neumorphismStyles.title}>
            NDRF
          </Typography>
          <Typography variant="subtitle1" sx={neumorphismStyles.subtitle}>
            Samarthya
          </Typography>
          
          {/* Show Logout button only if user is NOT admin */}
          {user?.role !== "admin" && (
            <Button size="small" onClick={handleLogout} sx={neumorphismStyles.logoutButton} startIcon={<ExitToAppIcon />}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={neumorphismStyles.container}>
        {children}
      </Container>
    </>
  );
};

export default Layout;
