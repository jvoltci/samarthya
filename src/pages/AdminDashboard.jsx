import React, { useState, useEffect } from 'react';
import { Grid, Typography, Paper, Card, CardContent, Button } from '@mui/material';
import { styled } from '@mui/system';
import Sidebar from '../components/shared/Sidebar';
import axios from '../services/api';
import { PieChart } from 'react-minimal-pie-chart';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/shared/LoadingSpinner';

// Neumorphism styles
export const StyledContainer = styled(Grid)({
  minHeight: '100vh',
  background: '#e0e5ec',
  padding: '20px',
  display: 'flex',
  justifyContent: 'center'
});

const StyledCard = styled(Card)({
  borderRadius: '20px',
  background: '#e0e5ec',
  boxShadow: '8px 8px 16px #b8bec6, -8px -8px 16px #ffffff',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '10px 10px 20px #b8bec6, -10px -10px 20px #ffffff',
  },
});

const StyledButton = styled(Button)({
  borderRadius: '12px',
  background: '#e0e5ec',
  boxShadow: '6px 6px 12px #b8bec6, -6px -6px 12px #ffffff',
  color: '#333',
  fontWeight: 'bold',
  padding: '12px 20px',
  textTransform: 'none',
  '&:hover': {
    background: '#d1d9e6',
  },
  '&:active': {
    boxShadow: 'inset 4px 4px 8px #b8bec6, inset -4px -4px 8px #ffffff',
  },
});

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    <StyledContainer container>

      {/* Main Content */}
      <Grid item xs={12} md={9}>
      <Sidebar role="admin" />

        {loading ? (
          <LoadingSpinner />
        ) : (
          <Grid container spacing={3}>
            {/* Employee Attendance */}
            <Grid item xs={12} sm={6} md={4}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6">Employee Attendance</Typography>
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
              </StyledCard>
            </Grid>

            {/* Leave Requests */}
            <Grid item xs={12} sm={6} md={4}>
              <StyledCard>
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
              </StyledCard>
            </Grid>

            {/* Equipment Status */}
            <Grid item xs={12} sm={6} md={4}>
              <StyledCard>
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
              </StyledCard>
            </Grid>

            {/* Manage Employees Button */}
            <Grid item xs={12} sx={{ textAlign: 'center', marginTop: '20px' }}>
              <StyledButton onClick={() => navigate('/admin/employee')}>Manage Employees</StyledButton>
            </Grid>
          </Grid>
        )}
      </Grid>
    </StyledContainer>
  );
};

export default AdminDashboard;
