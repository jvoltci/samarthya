import React, { useState, useEffect } from 'react';
import { Grid, Button, Typography, TextField } from '@mui/material';
import axios from '../services/api';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const LeaveRequests = () => {
  const [leaves, setLeaves] = useState([]);
  const [newLeave, setNewLeave] = useState({ reason: '', dates: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/leave/requests');
      setLeaves(data);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
    setLoading(false);
  };

  const submitLeaveRequest = async () => {
    if (!newLeave.reason || !newLeave.dates) {
      alert('Please fill all fields.');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/leave/request', newLeave);
      setNewLeave({ reason: '', dates: '' });
      fetchLeaveRequests();
    } catch (error) {
      console.error('Error submitting leave request:', error);
    }
    setLoading(false);
  };

  return (
    <Grid container spacing={2} className="container">
      <Grid item xs={12}>
        <Typography variant="h4">Leave Requests</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Reason"
          value={newLeave.reason}
          onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
          fullWidth
        />
        <TextField
          label="Dates"
          value={newLeave.dates}
          onChange={(e) => setNewLeave({ ...newLeave, dates: e.target.value })}
          fullWidth
          style={{ marginTop: '8px' }}
        />
        <Button variant="contained" color="primary" onClick={submitLeaveRequest} style={{ marginTop: '16px' }}>
          Submit Request
        </Button>
      </Grid>
      <Grid item xs={12}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          leaves.map((leave, index) => (
            <Typography key={index} variant="body1">
              {leave.dates} - {leave.reason} (Status: {leave.status})
            </Typography>
          ))
        )}
      </Grid>
    </Grid>
  );
};

export default LeaveRequests;
