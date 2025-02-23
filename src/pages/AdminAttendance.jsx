import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Grid, Typography, Paper } from '@mui/material';
import Sidebar from '../components/shared/Sidebar';
import axios from '../services/api';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const AdminAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const { data } = await axios.get('/employee/attendance/stats?filter=monthly');
      if (data?.stats) {
        setAttendanceData(data.stats);
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  useEffect(() => {
    if (attendanceData.length > 0) {
      const chartData = {
        labels: attendanceData.map((stat) => stat._id),
        datasets: [
          {
            label: 'Attendance Count',
            data: attendanceData.map((stat) => stat.count),
            borderColor: 'rgba(75,192,192,1)',
            fill: false,
          },
        ],
      };
      setChartData(chartData);
    }
  }, [attendanceData]);

  return (
    <Grid container spacing={2} className="container">
      <Grid item xs={12}>
        <Sidebar role="admin" />
        <Typography variant="h4">Attendance Analytics</Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={3} className="container">
          {chartData && chartData.labels && <Line data={chartData} />}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AdminAttendance;
