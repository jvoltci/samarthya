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
import { useParams, useNavigate } from 'react-router-dom';
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
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [openCourseDialog, setOpenCourseDialog] = useState(false);
  const [openEquipmentDialog, setOpenEquipmentDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const { user } = useAuth();
  const [validationError, setValidationError] = useState('');

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
                <MenuItem value="Junior">Junior</MenuItem>
                <MenuItem value="Senior">Senior</MenuItem>
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

        {/* Right Column - Courses & Equipment */}
        <Grid item xs={12} sm={6} container spacing={3}>
          {/* Courses Section */}
          <Grid item xs={12} >
            <Paper elevation={0} sx={neumorphismStyles.paper}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Courses</Typography>
              {employee?.courses?.map((course, index) => (
                <Typography key={index}>{course.name}</Typography>
              ))}
              {user?.role === 'admin' && (<Button sx={neumorphismStyles.button}  color='info' onClick={() => setOpenCourseDialog(true)} disabled={!editing}>
                Manage Courses
              </Button>)}
              <CourseDialog open={openCourseDialog} onClose={() => setOpenCourseDialog(false)} employee={employee} setEmployee={setEmployee} />
            </Paper>
          </Grid>

          {/* Equipment Section */}
          <Grid item xs={12} >
            <Paper elevation={0} sx={neumorphismStyles.paper}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Equipment</Typography>
              {employee?.equipment?.map((equipment, index) => (
                <Typography key={index}>{equipment.name}</Typography>
              ))}
              {user?.role === 'admin' && (<Button sx={neumorphismStyles.button}  color='info' onClick={() => setOpenEquipmentDialog(true)} disabled={!editing}>
                Manage Equipment
              </Button>)}
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
              <Button sx={neumorphismStyles.button}  color='inherit' onClick={() => setEditing(true)}>
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
