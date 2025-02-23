import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../../services/api';
import AddIcon from '@mui/icons-material/Add';

const AdminEmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    fetchEmployeeDetails();
  }, [id]);

  const fetchEmployeeDetails = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/employee`, {params: {_id: id}});
      setEmployee(data);
    } catch (err) {
      setError('Failed to load employee details.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!employee.name || !employee.role || !employee.rank || !employee.dob || !employee.doj) {
      setValidationError('All fields marked as required must be filled.');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await axios.put(`/employee/${id}`, employee);
      setEditing(false);
    } catch (err) {
      setError('Failed to save changes.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = () => {
    const newCourse = { name: '', completed: false };
    setEmployee({ ...employee, courses: [...employee.courses, newCourse] });
  };

  const handleAddLeave = () => {
    const newLeave = { type: '', from: '', to: '' };
    setEmployee({ ...employee, leaves: [...employee.leaves, newLeave] });
  };

  const handleAddEquipment = () => {
    const newEquipment = { name: '', assignedDate: '' };
    setEmployee({ ...employee, equipment: [...employee.equipment, newEquipment] });
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Grid container spacing={2} padding={4}>
      <Grid item xs={12}>
        <Typography variant="h4">Employee Profile</Typography>
      </Grid>

      {/* Basic Info Section */}
      <Grid item xs={12} sm={6}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h6">Basic Information</Typography>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={employee?.name || ''}
            onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
            disabled={!editing}
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Role</InputLabel>
            <Select
              value={employee?.role || ''}
              onChange={(e) => setEmployee({ ...employee, role: e.target.value })}
              disabled={!editing}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="employee">Employee</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Rank</InputLabel>
            <Select
              value={employee?.rank || ''}
              onChange={(e) => setEmployee({ ...employee, rank: e.target.value })}
              disabled={!editing}
            >
              <MenuItem value="Junior">Junior</MenuItem>
              <MenuItem value="Senior">Senior</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Regimental No"
            fullWidth
            margin="normal"
            value={employee?.regimentalNo || ''}
            onChange={(e) => setEmployee({ ...employee, regimentalNo: e.target.value })}
            disabled={!editing}
          />
          <TextField
            label="Date of Joining"
            fullWidth
            margin="normal"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={employee?.doj || ''}
            onChange={(e) => setEmployee({ ...employee, doj: e.target.value })}
            disabled={!editing}
            required
          />
          <TextField
            label="Date of Birth"
            fullWidth
            margin="normal"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={employee?.dob || ''}
            onChange={(e) => setEmployee({ ...employee, dob: e.target.value })}
            disabled={!editing}
            required
          />
        </Paper>
      </Grid>

      {/* Courses Section */}
      <Grid item xs={12} sm={6}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h6">Courses</Typography>
          {employee?.courses?.map((course, index) => (
            <Box key={index} sx={{ marginBottom: 2 }}>
              <TextField
                label="Course Name"
                fullWidth
                margin="normal"
                value={course.name || ''}
                onChange={(e) => {
                  const newCourses = [...employee?.courses];
                  newCourses[index].name = e.target.value;
                  setEmployee({ ...employee, courses: newCourses });
                }}
                disabled={!editing}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={() =>
                  setEmployee({
                    ...employee,
                    courses: employee?.courses.filter((_, i) => i !== index),
                  })
                }
                sx={{ mt: 1 }}
                disabled={!editing}
              >
                Remove Course
              </Button>
            </Box>
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddCourse}
            sx={{ mt: 2 }}
            disabled={!editing}
          >
            Add Course
          </Button>
        </Paper>
      </Grid>

      {/* Leaves Section */}
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h6">Leaves</Typography>
          {employee?.leaves?.map((leave, index) => (
            <Box key={index} sx={{ marginBottom: 2 }}>
              <TextField
                label="Leave Type"
                fullWidth
                margin="normal"
                value={leave.type || ''}
                onChange={(e) => {
                  const newLeaves = [...employee?.leaves];
                  newLeaves[index].type = e.target.value;
                  setEmployee({ ...employee, leaves: newLeaves });
                }}
                disabled={!editing}
              />
              <TextField
                label="From"
                fullWidth
                margin="normal"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={leave.from || ''}
                onChange={(e) => {
                  const newLeaves = [...employee?.leaves];
                  newLeaves[index].from = e.target.value;
                  setEmployee({ ...employee, leaves: newLeaves });
                }}
                disabled={!editing}
              />
              <TextField
                label="To"
                fullWidth
                margin="normal"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={leave.to || ''}
                onChange={(e) => {
                  const newLeaves = [...employee?.leaves];
                  newLeaves[index].to = e.target.value;
                  setEmployee({ ...employee, leaves: newLeaves });
                }}
                disabled={!editing}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={() =>
                  setEmployee({
                    ...employee,
                    leaves: employee?.leaves.filter((_, i) => i !== index),
                  })
                }
                sx={{ mt: 1 }}
                disabled={!editing}
              >
                Remove Leave
              </Button>
            </Box>
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddLeave}
            sx={{ mt: 2 }}
            disabled={!editing}
          >
            Add Leave
          </Button>
        </Paper>
      </Grid>

      {/* Equipment Section */}
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h6">Equipment</Typography>
          {employee?.equipment?.map((equip, index) => (
            <Box key={index} sx={{ marginBottom: 2 }}>
              <TextField
                label="Equipment Name"
                fullWidth
                margin="normal"
                value={equip.name || ''}
                onChange={(e) => {
                  const newEquipment = [...employee?.equipment];
                  newEquipment[index].name = e.target.value;
                  setEmployee({ ...employee, equipment: newEquipment });
                }}
                disabled={!editing}
              />
              <TextField
                label="Assigned Date"
                fullWidth
                margin="normal"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={equip.assignedDate || ''}
                onChange={(e) => {
                  const newEquipment = [...employee?.equipment];
                  newEquipment[index].assignedDate = e.target.value;
                  setEmployee({ ...employee, equipment: newEquipment });
                }}
                disabled={!editing}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={() =>
                  setEmployee({
                    ...employee,
                    equipment: employee?.equipment.filter((_, i) => i !== index),
                  })
                }
                sx={{ mt: 1 }}
                disabled={!editing}
              >
                Remove Equipment
              </Button>
            </Box>
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddEquipment}
            sx={{ mt: 2 }}
            disabled={!editing}
            startIcon={<AddIcon />}
          >
            Add Equipment
          </Button>
        </Paper>
      </Grid>

      {/* BMI Section */}
      <Grid item xs={12} sm={6}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h6">BMI</Typography>
          <TextField
            label="BMI"
            fullWidth
            margin="normal"
            value={employee?.bmi || ''}
            onChange={(e) => setEmployee({ ...employee, bmi: e.target.value })}
            disabled={!editing}
          />
        </Paper>
      </Grid>

      {/* Medical Records Section */}
      <Grid item xs={12} sm={6}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h6">Medical Records</Typography>
          <TextField
            label="Medical Condition"
            fullWidth
            margin="normal"
            value={employee?.medicalCondition || ''}
            onChange={(e) => setEmployee({ ...employee, medicalCondition: e.target.value })}
            disabled={!editing}
          />
        </Paper>
      </Grid>

      {/* Attendance Section */}
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h6">Attendance (Last 7 Days)</Typography>
          {employee?.attendance?.map((att, index) => (
            <Box key={index} sx={{ marginBottom: 2 }}>
              <Typography variant="body1">Date: {att.date}</Typography>
              <Typography variant="body2">Status: {att.status}</Typography>
            </Box>
          ))}
        </Paper>
      </Grid>

      {/* Validation Error */}
      {validationError && (
        <Grid item xs={12}>
          <Typography color="error">{validationError}</Typography>
        </Grid>
      )}

      {/* Save / Edit Button */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={() => navigate(-1)} variant="outlined">
            Go Back
          </Button>
          {editing ? (
            <Button onClick={handleSaveChanges} variant="contained" color="primary">
              Save Changes
            </Button>
          ) : (
            <Button onClick={() => setEditing(true)} variant="contained" color="secondary">
              Edit
            </Button>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default AdminEmployeeProfile;
