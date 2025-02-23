import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, Paper, TextField } from '@mui/material';
import Sidebar from '../components/shared/Sidebar';
import axios from '../services/api';

const EmployeeLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [formData, setFormData] = useState({ startDate: '', endDate: '', reason: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    const { data } = await axios.get('/leaves');
    setLeaves(data);
  };

  const submitLeaveRequest = async () => {
    setLoading(true);
    try {
      await axios.post('/leaves', formData);
      fetchLeaves();
      setFormData({ startDate: '', endDate: '', reason: '' });
    } catch (error) {
      console.error('Error submitting leave:', error);
    }
    setLoading(false);
  };

  return (
    <Grid container spacing={2} className="container">
      <Grid item xs={12}>
        <Sidebar role="employee" />
        <Typography variant="h4">Leave Requests</Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper className="container">
          <Typography variant="h6">Request Leave</Typography>
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
          <TextField
            fullWidth
            label="End Date"
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
          <TextField
            fullWidth
            label="Reason"
            name="reason"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          />
          <Button variant="contained" color="primary" onClick={submitLeaveRequest} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className="container">
          <Typography variant="h6">Leave History</Typography>
          {leaves.map((leave) => (
            <Typography key={leave._id}>
              {leave.startDate} to {leave.endDate} - {leave.status}
            </Typography>
          ))}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default EmployeeLeave;
