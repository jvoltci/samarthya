import React, { useState, useEffect } from 'react';
import { Grid, Typography, Alert, Paper, List, ListItem, ListItemText } from '@mui/material';
import axios from '../../../services/api';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';

const AdminAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/attendance');
      setAttendance(data);
    } catch (err) {
      setError('Failed to load attendance data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={2} padding={4}>
      <Grid item xs={12}>
        <Typography variant="h4">Attendance Records</Typography>
      </Grid>
      <Grid item xs={12}>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Paper elevation={3} sx={{ padding: 3 }}>
            <List>
              {attendance.map((record) => (
                <ListItem key={record._id}>
                  <ListItemText
                    primary={`Date: ${new Date(record.date).toLocaleDateString()}`}
                    secondary={`Status: ${record.status}, Remarks: ${record.remarks}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};

export default AdminAttendance;
