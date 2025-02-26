import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../../services/api';
import CourseDialog from './components/CourseDialog';
import AdminProfileLeave from './components/AdminProfileLeave';
import EquipmentDialog from './components/EquipmentDialog';
import AdminProfileBMI from './components/AdminProfileBMI';
import AdminProfileMedical from './components/AdminProfileMedical';
import { neumorphismStyles } from './Style';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';
import { useAuth } from '../../../context/AuthContext';

const AdminEmployeeProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [openCourseDialog, setOpenCourseDialog] = useState(false);
  const [openEquipmentDialog, setOpenEquipmentDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const { user } = useAuth();
  const [validationError, setValidationError] = useState('');

  const pathParts = location.pathname.split('/');
  const id = pathParts[pathParts.length - 1];

  useEffect(() => {
    fetchEmployeeDetails();
  }, [id]);

  const fetchEmployeeDetails = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/employee`, { params: { _id: id } });
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
      employee.bmi = employee.bmi?.length ? employee.bmi[0] : null;
      employee.medical = employee.medical?.length ? employee.medical[0] : null;
      employee.ppt = employee.ppt?.length ? employee.ppt[0] : null;
      await axios.put(`/employee/${id}`, employee);
      setEditing(false);
    } catch (err) {
      setError('Failed to save changes.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <Typography color="error">{error}</Typography>;
  return (
    <Grid container spacing={2} sx={{ paddingY: 4, }}>
      <Grid item xs={12}>
        <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 2 }}>
          Employee Profile
        </Typography>
      </Grid>

      {/* Basic Info Section */}
      <Grid container spacing={4} padding={4}>

        {/* Left Column - Basic Info */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={neumorphismStyles.paper}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
              Basic Information
            </Typography>
            <TextField
              sx={neumorphismStyles.input}
              label="Name"
              fullWidth
              margin="dense"
              value={employee?.name || ''}
              onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
              disabled={!editing}
              required
            />
            <FormControl fullWidth margin="dense" required>
              <InputLabel>Role</InputLabel>
              <Select
                sx={neumorphismStyles.input}
                value={employee?.role || ''}
                onChange={(e) => setEmployee({ ...employee, role: e.target.value })}
                disabled={!editing}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="employee">Employee</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense" required>
              <InputLabel>Rank</InputLabel>
              <Select
                sx={neumorphismStyles.input}
                value={employee?.rank || ''}
                onChange={(e) => setEmployee({ ...employee, rank: e.target.value })}
                disabled={!editing}
              >
                <MenuItem value="CT">CT</MenuItem>
                <MenuItem value="M/CT">M/CT</MenuItem>
                <MenuItem value="HC">HC</MenuItem>
                <MenuItem value="INSP">INSP</MenuItem>
                <MenuItem value="HC/RO">HC/RO</MenuItem>
                <MenuItem value="SI(RO)">{'SI(RO)'}</MenuItem>
                <MenuItem value="SI(JE)">{'SI(JE)'}</MenuItem>
                <MenuItem value="Cook">Cook</MenuItem>
              </Select>
            </FormControl>
            <TextField
              sx={neumorphismStyles.input}
              label="Regimental No"
              fullWidth
              margin="dense"
              value={employee?.regimentalNo || ''}
              onChange={(e) => setEmployee({ ...employee, regimentalNo: e.target.value })}
              disabled={!editing}
            />
            <TextField
              sx={neumorphismStyles.input}
              label="Date of Joining"
              fullWidth
              margin="dense"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={employee?.doj || ''}
              onChange={(e) => setEmployee({ ...employee, doj: e.target.value })}
              disabled={!editing}
              required
            />
            <TextField
              sx={neumorphismStyles.input}
              label="Date of Birth"
              fullWidth
              margin="dense"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={employee?.dob || ''}
              onChange={(e) => setEmployee({ ...employee, dob: e.target.value })}
              disabled={!editing}
              required
            />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} container spacing={3}>
          {/* Equipment Section */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                background: "#e0e0e0",
                boxShadow: "inset 6px 6px 12px #bebebe, inset -6px -6px 12px #ffffff",
                borderRadius: "16px",
                padding: "16px",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#555",
                  textShadow: "1px 1px 2px #bebebe",
                  marginBottom: "12px"
                }}
              >
                🛠 Equipment
              </Typography>

              {/* Flexbox Wrapping */}
              <Box sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                gap: "10px",
                padding: "8px",
              }}>
                {employee?.equipment?.length > 0 ? (
                  employee?.equipment?.map((equipment, index) => (
                    <Typography
                      key={index}
                      sx={{
                        fontSize: "1rem",
                        color: "#444",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        background: "#e0e0e0",
                        boxShadow: "4px 4px 8px #bebebe, -4px -4px 8px #ffffff",
                        display: "inline-block",
                        minWidth: "120px",
                        textAlign: "center",
                        flex: "1 1 auto",
                        maxWidth: "180px"
                      }}
                    >
                      {equipment.name}
                    </Typography>
                  ))
                ) : (
                  <Typography sx={{ fontSize: "1rem", color: "#777" }}>
                    No equipment assigned
                  </Typography>
                )}
              </Box>

              {user?.role === "admin" && (
                <Button
                  sx={{
                    background: "#e0e0e0",
                    boxShadow: "6px 6px 12px #bebebe, -6px -6px 12px #ffffff",
                    borderRadius: "12px",
                    padding: "8px 16px",
                    fontSize: "0.875rem",
                    fontWeight: "bold",
                    marginTop: "16px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
                      background: "#d1d9e6",
                    },
                    "&:disabled": {
                      background: "#f0f0f0",
                      boxShadow: "none",
                      color: "#aaa",
                    },
                  }}
                  color="info"
                  onClick={() => setOpenEquipmentDialog(true)}
                  disabled={!editing}
                >
                  Manage Equipment
                </Button>
              )}

              <EquipmentDialog open={openEquipmentDialog} onClose={() => setOpenEquipmentDialog(false)} employee={employee} setEmployee={setEmployee} />
            </Paper>
          </Grid>

        </Grid>

        {/* Action Buttons */}
        {user?.role === 'admin' && (<Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Button sx={neumorphismStyles.button} variant='outlined' onClick={() => navigate(-1)}>
              Go Back
            </Button>
            {editing ? (
              <Button sx={neumorphismStyles.button} variant='outlined' color='success' onClick={handleSaveChanges}>
                Save Changes
              </Button>
            ) : (
              <Button sx={neumorphismStyles.button} color='inherit' onClick={() => setEditing(true)}>
                Edit
              </Button>
            )}
          </Box>
        </Grid>)}
      </Grid>

      {/* Leaves Section */}
      <Grid item xs={12}>
        <AdminProfileLeave employeeId={id} />
      </Grid>



      {/* BMI & Medical Sections */}
      <Grid item xs={12} sm={6}>
        <Paper elevation={0} sx={neumorphismStyles.paper}>
          <AdminProfileBMI employeeId={id} />
        </Paper>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Paper elevation={0} sx={neumorphismStyles.paper}>
          <AdminProfileMedical employeeId={id} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AdminEmployeeProfile;
