import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, CircularProgress, Alert, Paper, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from '../../../services/api';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import Sidebar from '../../../components/shared/Sidebar';

export const initialFormData = {
  name: '', phone: '', dob: '', role: '', regimentalNo: '', rank: '', doj: ''
}

const AdminEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(initialFormData);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Flag to track if it's edit mode

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/employee');
      setEmployees(data);
    } catch (err) {
      setError('Failed to load employee data.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeSubmit = async () => {
    setLoading(true);
    try {
      const password = Math.floor(100000 + Math.random() * 900000).toString();
      if (isEditMode) {
        await axios.put(`/employee/${formData._id}`, { ...formData }); // Update employee
      } else {
        await axios.post('/employee', { ...formData, password }); // Create employee
      }
      fetchEmployees();
      resetForm();
      setOpenDialog(false);
    } catch (err) {
      setError('Error creating/updating employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', phone: '', dob: '', role: '', regimentalNo: '', rank: '', doj: ''
    });
    setIsEditMode(false);
  };

  const handleEdit = (employee) => {
    setFormData(employee); 
    setIsEditMode(true);
    setOpenDialog(true);
  };

  return (
    <div>
      <Sidebar role={'admin'} />
      <Grid container spacing={2} padding={4}>
        <Grid item xs={12}>
          <Typography variant="h4">Employees</Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDialog(true)}
            startIcon={<AddIcon />}
            sx={{ mb: 2 }}
          >
            Add Employee
          </Button>
        </Grid>

        <Grid item xs={12}>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Paper elevation={3} sx={{ padding: 3 }}>
              <EmployeeList
                employees={employees}
                onEdit={handleEdit}  // Pass handleEdit to the list
                onDelete={async (id) => {
                  try {
                    await axios.delete(`admin/employee/${id}`);
                    fetchEmployees();
                  } catch (err) {
                    setError('Failed to delete employee.');
                  }
                }}
              />
            </Paper>
          )}
        </Grid>
      </Grid>

      <EmployeeForm
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleEmployeeSubmit}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        loading={loading}
        setIsEditMode={setIsEditMode}
        isEditMode={isEditMode}
      />
    </div>
  );
};

export default AdminEmployee;
