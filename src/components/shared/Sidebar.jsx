import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Menu, MenuItem, IconButton, Box, Typography, Paper } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const neumorphismStyles = {
  sidebarBox: {
    display: "flex",
    alignItems: "center",
    background: "#e0e0e0",
    borderRadius: "12px",
    padding: "8px 12px",
    margin: "16px",
    boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
  },
  menuButton: {
    background: "#e0e0e0",
    boxShadow: "4px 4px 8px #bebebe, -4px -4px 8px #ffffff",
    borderRadius: "50%",
    padding: "8px",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
    },
  },
  menuPaper: {
    background: "#e0e0e0",
    boxShadow: "6px 6px 12px #bebebe, -6px -6px 12px #ffffff",
    borderRadius: "12px",
    padding: "8px",
  },
  menuItem: {
    background: "#e0e0e0",
    boxShadow: "inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff",
    borderRadius: "8px",
    margin: "4px 0",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "inset 6px 6px 12px #bebebe, inset -6px -6px 12px #ffffff",
    },
  },
  navLink: {
    textDecoration: "none",
    color: "#333",
    fontSize: "16px",
    fontWeight: "500",
  },
  logout: {
    color: "red",
    fontWeight: "bold",
    textShadow: "1px 1px 2px #bebebe",
  },
};

const Sidebar = ({ role }) => {
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const toggleMenu = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const closeMenu = () => setAnchorEl(null);
  
  const links = role === "admin"
    ? [
        { path: "/admin/employee", label: "Employees" },
        { path: "/admin/leave", label: "Leaves" },
        { path: "/admin/course", label: "Course" },
        { path: "/admin/bmi", label: "BMI" },
        { path: "/admin/medical", label: "Medical" },
        { path: "/admin/equipment", label: "Equipment" },
        { path: "/admin/user", label: "Manage User" },
      ]
    : [
        { path: "/employee/leaves", label: "Leaves" },
        { path: "/employee/profile", label: "Profile" },
      ];

  return (
    <Box sx={neumorphismStyles.sidebarBox}>
      {/* Menu Button */}
      <IconButton onClick={toggleMenu} sx={neumorphismStyles.menuButton}>
        <MenuIcon />
      </IconButton>

      <Typography variant="h6" sx={{ ml: 2 }}>
        {role === "admin" ? "Admin Dashboard" : "Employee Dashboard"}
      </Typography>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        keepMounted
        PaperProps={{ sx: neumorphismStyles.menuPaper }}
      >
        {links.map((link) => (
          <MenuItem key={link.path} onClick={closeMenu} sx={neumorphismStyles.menuItem}>
            <NavLink to={link.path} style={neumorphismStyles.navLink}>
              {link.label}
            </NavLink>
          </MenuItem>
        ))}
        <MenuItem onClick={logout} sx={neumorphismStyles.menuItem}>
          <Typography sx={neumorphismStyles.logout}>Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Sidebar;
