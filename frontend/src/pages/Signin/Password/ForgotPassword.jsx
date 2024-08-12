import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../Signin.css'
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/user/forgotpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send reset email');
      }

      alert('Reset email sent! Please check your inbox.');
      navigate('/verify-otp'); // Use navigate instead of history.push
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Box className="centered-container">
      <Box className="form-container">
      <Typography variant="h4">Forgot Password</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Send Reset Link
        </Button>
      </form>
    </Box>
    </Box>
  );
};

export default ForgotPassword;