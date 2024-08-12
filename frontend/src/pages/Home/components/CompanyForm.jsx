import { Box, Paper, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

const CompanyForm = ({ onFormFilled }) => {
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [dateOfJoining, setDateOfJoining] = useState('');
  const [designation, setDesignation] = useState('');

  const handleInputChange = () => {
    // Check if all fields are filled
    if (companyName && companyEmail && dateOfJoining && designation) {
      onFormFilled({
        companyName,
        companyEmail,
        dateOfJoining,
        designation,
      });
    } else {
      onFormFilled(null);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: '15px',
        padding: 2,
        marginBottom: 2,
        width: '100%',
        backgroundColor: 'var(--primary-color)',
        color: 'var(--text-color)',
      }}
    >
      <Typography variant="h6">Employer Details</Typography>
      <Box mt={2}>
        <TextField
          label="Company Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={companyName}
          onChange={(e) => {
            setCompanyName(e.target.value);
            handleInputChange();
          }}
        />
        <TextField
          label="Company Email ID"
          variant="outlined"
          fullWidth
          margin="normal"
          value={companyEmail}
          onChange={(e) => {
            setCompanyEmail(e.target.value);
            handleInputChange();
          }}
        />
        <TextField
          label="Date Of Joining"
          type="date"
          variant="outlined"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={dateOfJoining}
          onChange={(e) => {
            setDateOfJoining(e.target.value);
            handleInputChange();
          }}
        />
        <TextField
          label="Designation"
          variant="outlined"
          fullWidth
          margin="normal"
          value={designation}
          onChange={(e) => {
            setDesignation(e.target.value);
            handleInputChange();
          }}
        />
      </Box>
    </Paper>
  );
};

export default CompanyForm;