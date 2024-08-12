import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import './Signin.css'
const Signin = ({ onSignin }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      email,
      password,
    };

    try {
      const response = await fetch('http://localhost:4000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Signin failed!');
      }

      const data = await response.json();
      onSignin(data); // Call the onSignin function passed as a prop with the token
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box className="centered-container">
      <Box className="form-container">
        <Typography variant="h4">Sign In</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary">
            Sign In
          </Button>
        </form>
        <Link to="/forgot-password">
          <Typography variant="body2" color="primary">
            Forgot Password?
          </Typography>
        </Link>
          <Typography variant="body2" color="black">
        {"Don't have a account? "}<Link to="/signup">
            Sign up
        </Link>{" now!"}
          </Typography>
      </Box>
    </Box>
  );
};

export default Signin;