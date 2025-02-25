import React, { useState, useEffect } from 'react';
import { Grid, Typography, Card, CardContent } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import axios from '../services/api';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const AdminAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/analytics');
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
    setLoading(false);
  };

  return (
    <Grid container spacing={2} className="container">
      <Grid item xs={12}>
        <Typography variant="h4">Admin Analytics</Typography>
      </Grid>
      {loading ? (
        <LoadingSpinner />
      ) : (
        analyticsData && (
          <>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Attendance Trends</Typography>
                  <Bar
                    data={{
                      labels: analyticsData.attendance.labels,
                      datasets: [
                        {
                          label: 'Attendance',
                          data: analyticsData.attendance.data,
                          backgroundColor: 'rgba(75,192,192,0.6)',
                        },
                      ],
                    }}
                    options={{ responsive: true }}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Equipment Usage</Typography>
                  <Bar
                    data={{
                      labels: analyticsData.equipmentUsage.labels,
                      datasets: [
                        {
                          label: 'Usage',
                          data: analyticsData.equipmentUsage.data,
                          backgroundColor: 'rgba(255,99,132,0.6)',
                        },
                      ],
                    }}
                    options={{ responsive: true }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </>
        )
      )}
    </Grid>
  );
};

export default AdminAnalytics;
