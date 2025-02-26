import React, { useState } from "react";
import {
  AppBar, Toolbar, Typography, Container, Box,
  IconButton, Button, Tooltip, Dialog, DialogTitle,
  DialogContent, TextField, DialogActions
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate, useLocation } from "react-router-dom";
import NDRF from "../../assets/ndrf_logo.png";
import { useAuth } from "../../context/AuthContext";
import axios from "../../services/api";
import { neumorphismStyles } from "../../pages/Admin/Employee/Style";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [openDialog, setOpenDialog] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const showBackButton = location.pathname !== "/employee" && location.pathname !== "/admin";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handlePasswordReset = async () => {
    if (!newPassword || !confirmPassword) {
      setMessage("Please fill in both fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await axios.put(`/user/${user.id}`, { password: newPassword });
      setMessage("Password successfully changed!");
      setTimeout(() => {
        setOpenDialog(false);
        setNewPassword("");
        setConfirmPassword("");
        setMessage("");
      }, 1500);
    } catch (error) {
      setMessage("Error updating password. Try again.");
    } finally {
      setLoading(false);
    }
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
          <Box sx={neumorphismStyles.subtitle}>
            <Typography variant="subtitle1">Samarthya</Typography>
            {user?.role !== "admin" && (
              <Tooltip title="Change Password">
                <IconButton
                  onClick={() => setOpenDialog(true)}
                  sx={{ ml: 1, ...neumorphismStyles.iconButton }}
                >
                  <SettingsIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          {/* Logout button only for non-admin users */}
          {user?.role !== "admin" && (
            <Button
              size="small"
              onClick={handleLogout}
              sx={neumorphismStyles.logoutButton}
              startIcon={<ExitToAppIcon />}
            >
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={neumorphismStyles.container}>
        {children}
      </Container>

      {/* Password Reset Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent sx={neumorphismStyles.container}>
          <TextField
            sx={neumorphismStyles.input}
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            sx={neumorphismStyles.input}
            margin="dense"
            label="Confirm Password"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {message && <Typography color="error" variant="body2">{message}</Typography>}
          <DialogActions>
            <Button sx={neumorphismStyles.button} onClick={() => setOpenDialog(false)} color="secondary">
              Cancel
            </Button>
            <Button sx={neumorphismStyles.button} onClick={handlePasswordReset} color="primary" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </DialogActions>
        </DialogContent>

      </Dialog>
    </>
  );
};

export default Layout;
