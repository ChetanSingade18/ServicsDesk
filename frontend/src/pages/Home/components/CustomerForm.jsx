import { Box, Paper, TextField, Typography, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import React, { useState } from 'react';

const CustomerForm = ({ onCustomerDataChange }) => {
  const [fullName, setFullName] = useState(''); // State for full name
  const [empId, setEmpId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [dob, setDob] = useState('');
  const [userPhotoPath, setUserPhotoPath] = useState(''); // State to hold the user photo path
  const [idPhotoPath, setIdPhotoPath] = useState(''); // State to hold the ID photo path

  const handleInputChange = () => {
    onCustomerDataChange({
      fullName,
      empId,
      mobileNumber,
      address,
      bloodGroup,
      dob,
      userPhotoPath,
      idPhotoPath,
    });
  };

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const uploadResponse = await fetch('http://localhost:4000/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload file');
        }

        const { filePath } = await uploadResponse.json();
        if (type === 'userPhoto') {
          setUserPhotoPath(filePath);
        } else {
          setIdPhotoPath(filePath);
        }
        
        handleInputChange(); // Update the parent component
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: '15px',
        padding: 2,
        width: '100%',
        backgroundColor: 'var(--primary-color)',
        color: 'var(--text-color)',
      }}
    >
      <Typography variant="h6">Employee Details</Typography>
      <Box mt={2}>
        <TextField
          label="Full Name" // New Full Name field
          variant="outlined"
          fullWidth
          margin="normal"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            handleInputChange();
          }}
        />
        <TextField
          label="Emp ID"
          variant="outlined"
          fullWidth
          margin="normal"
          value={empId}
          onChange={(e) => {
            setEmpId(e.target.value);
            handleInputChange();
          }}
        />
        <Button variant="contained" component="label" fullWidth>
          User Photo
          <input type="file" hidden onChange={(e) => handleFileChange(e, 'userPhoto')} accept="image/*" />
        </Button>
        <TextField
          label="Mobile Number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={mobileNumber}
          onChange={(e) => {
            setMobileNumber(e.target.value);
            handleInputChange();
          }}
        />
        <Button variant="contained" component="label" fullWidth>
          ID Photo
          <input type="file" hidden onChange={(e) => handleFileChange(e, 'idPhoto')} accept="image/*" />
        </Button>
        <TextField
          label="Address"
          variant="outlined"
          fullWidth
          margin="normal"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            handleInputChange();
          }}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Blood Group</InputLabel>
          <Select
            value={bloodGroup}
            onChange={(e) => {
              setBloodGroup(e.target.value);
              handleInputChange();
            }}
          >
            <MenuItem value="A+">A+</MenuItem>
            <MenuItem value="A-">A-</MenuItem>
            <MenuItem value="B+">B+</MenuItem>
            <MenuItem value="B-">B-</MenuItem>
            <MenuItem value="O+">O+</MenuItem>
            <MenuItem value="O-">O-</MenuItem>
            <MenuItem value="AB+">AB+</MenuItem>
            <MenuItem value="AB-">AB-</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Date of Birth"
          type="date"
          variant="outlined"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={dob}
          onChange={(e) => {
            setDob(e.target.value);
            handleInputChange();
          }}
        />
      </Box>
    </Paper>
  );
};

export default CustomerForm;