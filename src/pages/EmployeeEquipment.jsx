import React, { useState, useEffect } from 'react';
import { Typography, Grid, CircularProgress } from '@mui/material';
import axios from '../services/api';

const EmployeeEquipment = () => {
  const [assignedEquipment, setAssignedEquipment] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAssignedEquipment();
  }, []);

  const fetchAssignedEquipment = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/equipment/assigned');
      setAssignedEquipment(data);
    } catch (error) {
      console.error('Error fetching assigned equipment:', error);
    }
    setLoading(false);
  };

  return (
    <Grid container spacing={2} className="container">
      <Grid item xs={12}>
        <Typography variant="h4">My Equipment</Typography>
      </Grid>
      <Grid item xs={12}>
        {loading ? (
          <CircularProgress />
        ) : (
          assignedEquipment.map((equipment) => (
            <Grid container spacing={2} key={equipment._id} style={{ marginBottom: '16px' }}>
              <Grid item xs={6}>
                <Typography>{equipment.name}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>Status: {equipment.status}</Typography>
              </Grid>
            </Grid>
          ))
        )}
      </Grid>
    </Grid>
  );
};

export default EmployeeEquipment;
