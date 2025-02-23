import React, { useState } from 'react';
import axios from '../services/api';
import { Button, Typography, Grid, Paper } from '@mui/material';
import Sidebar from '../components/shared/Sidebar';

const EmployeeDashboard = () => {
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  const markAttendance = async () => {
    try {
      await axios.post('/attendance/mark', { date: new Date() });
      setAttendanceMarked(true);
    } catch (err) {
      console.error('Error marking attendance:', err);
    }
  };

  return (
    <Grid container spacing={2} className="container">
      <Grid item xs={12}>
        <Sidebar role="employee" />
        <Typography variant="h4">Employee Dashboard</Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={3} className="container">
          <Typography variant="h6">Mark Your Attendance</Typography>
          {attendanceMarked ? (
            <Typography variant="body1" color="success">
              Attendance Marked for Today!
            </Typography>
          ) : (
            <Button variant="contained" color="primary" onClick={markAttendance}>
              Mark Attendance
            </Button>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default EmployeeDashboard;
