import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useNavigate,Link } from 'react-router-dom';

const Signup = ({ onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      email,
      password,
      userName,
    };

    try {
      const response = await fetch('http://localhost:4000/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Signup failed!');
      }

      const data = await response.json();
      onSignup(data); // Call the onSignup function passed as a prop

      // Redirect to the Signin page after successful signup
      navigate('/signin'); // Use navigate to redirect

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box className="centered-container">
      <Box className="form-container">
        <Container maxWidth="sm">
          <Typography variant="h4" gutterBottom>
            Sign Up
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <form onSubmit={handleSignup}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Sign Up
            </Button>
            <Typography variant="body2" color="black">
              {"Already have an account? Click here to "}
              <Link to="/signin">
                Sign in
              </Link>!
            </Typography>
          </form>
        </Container>
      </Box>
    </Box>
  );
};

export default Signup;