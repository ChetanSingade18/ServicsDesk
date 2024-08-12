import './Dashboard.css'; // Import the CSS file

import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = ({role, token, userId }) => {
  const [metrics, setMetrics] = useState({
    open: 0,
    resolved: 0,
    waitingForApproval: 0,
    approved: 0,
  });

  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('http://localhost:4000/tickets'+(role==="user"?"/user":""), {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'userId': userId,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch ticket metrics');
        }

        const data = await response.json();
        setMetrics(data); // Update metrics with the fetched data
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      }
    };

    if (token && userId) {
      fetchMetrics();
    }
  }, [token, userId,role]);

  // Prepare the data for the bar chart
  // "totalTickets": 7,
  // "resolvedTickets": 0,
  // "pendingTickets": 7,
  // "approvedTickets": 0
  const chartData = [
    { name: 'Total', value: metrics.totalTickets },
    { name: 'Resolved', value: metrics.resolvedTickets },
    { name: 'Waiting for Approval', value: metrics.pendingTickets },
    { name: 'Approved', value: metrics.approvedTickets },
  ];

  // Prepare the data for the pie chart
  const pieChartData = [
    { name: 'Total', value: metrics.totalTickets },
    { name: 'Resolved', value: metrics.resolvedTickets },
    { name: 'Waiting for Approval', value: metrics.pendingTickets },
    { name: 'Approved', value: metrics.approvedTickets },
  ];

  // Define colors for the pie chart slices
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Typography variant="h4">Dashboard</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Box className="dashboard-container">
        <Box className="metric-box open-tickets">
          <Typography variant="h6">Total Tickets</Typography>
          <Typography variant="h4">{metrics.totalTickets}</Typography>
        </Box>
        <Box className="metric-box resolved-tickets">
          <Typography variant="h6">Resolved Tickets</Typography>
          <Typography variant="h4">{metrics.resolvedTickets}</Typography>
        </Box>
        <Box className="metric-box waiting-approval">
          <Typography variant="h6">Waiting for Approval</Typography>
          <Typography variant="h4">{metrics.pendingTickets}</Typography>
        </Box>
        <Box className="metric-box approved-tickets">
          <Typography variant="h6">Approved Tickets</Typography>
          <Typography variant="h4">{metrics.approvedTickets}</Typography>
        </Box>
      </Box>

      {/* Ticket Frequency Chart (Bar Chart) */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h5">Ticket Frequency Bar Chart</Typography>
        <BarChart width={600} height={400} data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </Box>

      {/* Ticket Distribution Pie Chart */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h5">Ticket Distribution Pie Chart</Typography>
        <PieChart width={600} height={400}>
          <Pie
            data={pieChartData}
            cx={300}
            cy={200}
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
          >
            {pieChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </Box>

      <ToastContainer />
    </Box>
  );
};

export default Dashboard;