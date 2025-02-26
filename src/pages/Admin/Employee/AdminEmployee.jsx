import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Alert,
  Paper,
  TextField,
  MenuItem,
  Tooltip,
  IconButton,
} from "@mui/material";
import axios from "../../../services/api";
import EmployeeList from "./components/EmployeeList";
import TuneIcon from '@mui/icons-material/Tune';
import Sidebar from "../../../components/shared/Sidebar";
import { neumorphismStyles } from "./Style";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";

export const initialFormData = {
  name: "",
  phone: "",
  dob: "",
  role: "",
  regimentalNo: "",
  rank: "",
  doj: "",
};

const AdminEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [openDialog, setOpenDialog] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    on_leave: "",
    course: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    fetchEmployees();
    fetchCourses();
  }, [filters]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/employee", { params: filters });
      setEmployees(data);
    } catch (err) {
      setError("Failed to load employee data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get("/course");
      setCourses(data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleEmployeeSubmit = async () => {
    setLoading(true);
    try {
      const password = Math.floor(100000 + Math.random() * 900000).toString();
      if (isEditMode) {
        await axios.put(`/employee/${formData._id}`, { ...formData });
      } else {
        await axios.post("/employee", { ...formData, password });
      }
      fetchEmployees();
      resetForm();
      setOpenDialog(false);
    } catch (err) {
      setError("Error creating/updating employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setIsEditMode(false);
  };

  const handleEdit = (employee) => {
    setFormData(employee);
    setIsEditMode(true);
    setOpenDialog(true);
  };

  return (
    <div>
      <Sidebar role={"admin"} />
      <Grid container sx={neumorphismStyles.container}>
        <Grid item xs={12} sx={{ mb: 1 }}>
          <Typography variant="h4" sx={{mb: 1, ...neumorphismStyles.typography}}>
            Employees
            <Tooltip title="Filters">
              <IconButton size="small" sx={{ ml: 1, ...neumorphismStyles.button }} color={openFilter ? 'success' : ''} onClick={() => setOpenFilter(prev => !prev)}>
                <TuneIcon />
              </IconButton>
            </Tooltip>
          </Typography>
        </Grid>

        {/* Filters */}
        {openFilter && (<Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item xs={12} md={2.5}>
            <TextField
              select
              fullWidth
              label="Leave Status"
              value={filters.on_leave}
              onChange={(e) => handleFilterChange("on_leave", e.target.value)}
              sx={neumorphismStyles.input}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">On Leave</MenuItem>
              <MenuItem value="false">Not On Leave</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={filters.start_date}
              onChange={(e) =>
                handleFilterChange("start_date", e.target.value)
              }
              sx={neumorphismStyles.input}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={filters.end_date}
              onChange={(e) =>
                handleFilterChange("end_date", e.target.value)
              }
              sx={neumorphismStyles.input}
            />
          </Grid>

          {/* Course Filter */}
          <Grid item xs={12} md={2.5}>
            <TextField
              select
              fullWidth
              label="Course"
              value={filters.course}
              onChange={(e) => handleFilterChange("course", e.target.value)}
              sx={neumorphismStyles.input}
            >
              <MenuItem value="">All Courses</MenuItem>
              {courses.map((course) => (
                <MenuItem key={course._id} value={course._id}>
                  {course.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>)}

        {/* Employee List */}
        <Grid item xs={12}>
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <Alert severity="error" sx={neumorphismStyles.alert}>
              {error}
            </Alert>
          ) : (
            <Paper sx={neumorphismStyles.paper}>
              <EmployeeList
                employees={employees}
                onEdit={handleEdit}
                onDelete={async (id) => {
                  try {
                    await axios.delete(`/employee/${id}`);
                    fetchEmployees();
                  } catch (err) {
                    setError("Failed to delete employee.");
                  }
                }}
              />
            </Paper>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminEmployee;
