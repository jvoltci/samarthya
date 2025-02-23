import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Menu, MenuItem, IconButton, Box, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Sidebar = ({ role }) => {
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const toggleMenu = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const closeMenu = () => setAnchorEl(null);
  const links =
    role === "admin"
      ? [
          { path: "/admin/employee", label: "Employees" },
          { path: "/admin/leave", label: "Leaves" },
          { path: "/admin/course", label: "Course" },
          { path: "/admin/bmi", label: "BMI" },
          { path: "/admin/medical", label: "Medical" },
          { path: "/admin/attendance", label: "Attendance" },
          { path: "/admin/equipment", label: "Equipment" },
        ]
      : [
          { path: "/employee/attendance", label: "Mark Attendance" },
          { path: "/employee/leaves", label: "Leaves" },
          { path: "/employee/profile", label: "Profile" },
        ];

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {/* Burger Icon */}
      <IconButton onClick={toggleMenu} sx={{ color: "inherit" }}>
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
        sx={{ mt: 2 }}
      >
        {links.map((link) => (
          <MenuItem key={link.path} onClick={closeMenu}>
            <NavLink
              to={link.path}
              style={{
                textDecoration: "none",
                color: "inherit",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              {link.label}
            </NavLink>
          </MenuItem>
        ))}
        <MenuItem onClick={logout}>
          <Typography color="error">Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Sidebar;
