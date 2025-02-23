import React, { useState, useEffect } from 'react';
import { Grid, Typography, Paper, Card, CardContent, Button, CircularProgress } from '@mui/material';
import Sidebar from '../components/shared/Sidebar';
import axios from '../services/api';
import { PieChart } from 'react-minimal-pie-chart';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/admin/analytics');
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
    setLoading(false);
  };

  return (
    <Grid container spacing={2} className="container">
      <Grid item xs={12}>
        <Sidebar role="admin" />
        <Typography variant="h4">Admin Dashboard</Typography>
      </Grid>
      <Grid item xs={12}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Employee Attendance Status</Typography>
                    <PieChart
                      data={[
                        { title: 'Present', value: analytics.present, color: '#4caf50' },
                        { title: 'Absent', value: analytics.absent, color: '#f44336' },
                      ]}
                      lineWidth={20}
                      paddingAngle={18}
                      radius={42}
                    />
                    <Typography variant="body2" color="textSecondary">
                      Total Employees: {analytics.totalEmployees}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Leave Requests</Typography>
                    <PieChart
                      data={[
                        { title: 'Approved', value: analytics.approvedLeaves, color: '#4caf50' },
                        { title: 'Pending', value: analytics.pendingLeaves, color: '#ff9800' },
                        { title: 'Rejected', value: analytics.rejectedLeaves, color: '#f44336' },
                      ]}
                      lineWidth={20}
                      paddingAngle={18}
                      radius={42}
                    />
                    <Typography variant="body2" color="textSecondary">
                      Total Leaves: {analytics.totalLeaves}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Equipment Status</Typography>
                    <PieChart
                      data={[
                        { title: 'Serviceable', value: analytics.serviceableEquipments, color: '#4caf50' },
                        { title: 'Non-Serviceable', value: analytics.nonServiceableEquipments, color: '#f44336' },
                      ]}
                      lineWidth={20}
                      paddingAngle={18}
                      radius={42}
                    />
                    <Typography variant="body2" color="textSecondary">
                      Total Equipment: {analytics.totalEquipments}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={() => window.location.href = '/admin/employees'}>
                  Manage Employees
                </Button>
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default AdminDashboard;
