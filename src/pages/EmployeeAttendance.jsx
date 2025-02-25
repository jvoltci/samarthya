import React, { useState, useEffect } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import axios from '../services/api';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const EmployeeAttendance = () => {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    getAttendanceStatus();
  }, []);

  const getAttendanceStatus = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/attendance/status');
      setAttendance(data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
    setLoading(false);
  };

  const markAttendance = async (type) => {
    if (!location) {
      alert('Please enable location access to mark attendance.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post('/attendance/mark', { type, location });
      setAttendance(data);
      alert('Attendance marked successfully!');
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Failed to mark attendance. Please try again.');
    }
    setLoading(false);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, long: pos.coords.longitude }),
        (err) => console.error('Error fetching location:', err)
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <Grid container spacing={2} className="container">
      <Grid item xs={12}>
        <Typography variant="h4">Mark Attendance</Typography>
        <Button variant="outlined" color="primary" onClick={getLocation}>
          Enable Location
        </Button>
      </Grid>
      <Grid item xs={12}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {attendance ? (
              <Typography variant="body1">
                Last Marked: {attendance.lastMarked || 'No attendance data found.'}
              </Typography>
            ) : (
              <Typography variant="body1">Attendance not marked today.</Typography>
            )}
          </>
        )}
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={() => markAttendance('check-in')}>
          Check-In
        </Button>
        <Button variant="contained" color="secondary" onClick={() => markAttendance('check-out')}>
          Check-Out
        </Button>
      </Grid>
    </Grid>
  );
};

export default EmployeeAttendance;
