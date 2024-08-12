import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../Signin.css'
const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/user/resetpassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ otp, password, confirmPassword }),
            });

            if (!response.ok) {
                throw new Error('Failed to reset password');
            }

            alert('Password reset successfully! You can now log in.');
            navigate('/signin'); // Use navigate instead of history.push
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <Box className="centered-container">
            <Box className="form-container">
                <Typography variant="h4">Verify OTP</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="New Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Reset Password
                    </Button>
                </form>
            </Box>
        </Box>
    );
};

export default VerifyOtp;