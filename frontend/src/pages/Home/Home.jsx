import { Box, Toolbar, Button, Card, CardContent, Typography, Grid, Divider, Avatar,Container,useTheme  } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import CompanyForm from './components/CompanyForm';
import CustomerForm from './components/CustomerForm';

const Home = ({ userId, token }) => {
  const [companyData, setCompanyData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [userData, setUserData] = useState(null)

  const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: theme.spacing(15),
    height: theme.spacing(15),
    marginBottom: theme.spacing(2),
  }));
  const theme = useTheme();  

  useEffect(()=>{
    const getUserData=async ()=>{
      try {
        
        const response = await fetch(`http://localhost:4000/user/getuser/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });
        setUserData(await response.json())
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
      return ()=>{console.log("sdfghjkl;")};
    }
    getUserData();
  },[token,userId]);

  const handleCompanyFormFilled = (data) => {
    setCompanyData(data);
    console.log(data)
  };

  const handleCustomerDataChange = (data) => {
    setCustomerData(data);
  };

  const handleSubmit = async () => {
    try {
      // Upload company logo if needed
      // Similar logic as before for uploading files and sending the PUT request

      // Prepare data for the PUT request
      const updateData = {
        employerDetails: companyData,
        employeeId: customerData.empId,
        mobile: customerData.mobileNumber,
        fullName:customerData.fullName,
        address: customerData.address,
        bloodGroup: customerData.bloodGroup,
        dateOfBirth: customerData.dob,
        userPhotoUrl: customerData.userPhotoPath,
        idPhotoUrl: customerData.idPhotoPath,
      };
      console.log(updateData,customerData);
      // Send the PUT request
      const response = await fetch(`http://localhost:4000/user/updateuser/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user details');
      }

      alert('User details updated successfully');
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    (userData?.employeeDetails && userData?.employerDetails)? 
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
    <Container maxWidth="lg" sx={{ flex: 1, display: 'flex', flexDirection: 'column', padding: theme.spacing(4) }}>
      <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            User Details
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} sm={4} textAlign="center">
              <StyledAvatar
              sx={{margin:"auto"}}
                alt={userData.employeeDetails.fullName}
                src={userData.employeeDetails.userPhotoUrl} // Display user photo
              />
              <Typography variant="h5" gutterBottom>
                {userData.employeeDetails.fullName}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {userData.email}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={8}>
              <Typography variant="h6" gutterBottom>
                General Information
              </Typography>
              <Divider />
              <Box sx={{ mt: 2 }}>
                <Typography><strong>Email:</strong> {userData.email}</Typography>
                <Typography><strong>Username:</strong> {userData.userName}</Typography>
                <Typography><strong>Status:</strong> {userData.status}</Typography>
                <Typography><strong>Role:</strong> {userData.role}</Typography>
                <Typography><strong>Created At:</strong> {new Date(userData.createdAt).toLocaleDateString()}</Typography>
                <Typography><strong>Updated At:</strong> {new Date(userData.updatedAt).toLocaleDateString()}</Typography>
              </Box>

              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Employee Details
              </Typography>
              <Divider />
              <Box sx={{ mt: 2 }}>
                <Typography><strong>Employee ID:</strong> {userData.employeeDetails.employeeId}</Typography>
                <Typography><strong>Address:</strong> {userData.employeeDetails.address}</Typography>
                <Typography><strong>Blood Group:</strong> {userData.employeeDetails.bloodGroup}</Typography>
                <Typography><strong>Date of Birth:</strong> {userData.employeeDetails.dateOfBirth || 'N/A'}</Typography>
                <Typography><strong>Mobile:</strong> {userData.employeeDetails.mobile}</Typography>
              </Box>

              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Employer Details
              </Typography>
              <Divider />
              <Box sx={{ mt: 2 }}>
                <Typography><strong>Company Name:</strong> {userData.employerDetails.companyName}</Typography>
                <Typography><strong>Company Email:</strong> {userData.employerDetails.companyEmail}</Typography>
                <Typography><strong>Date of Joining:</strong> {new Date(userData.employerDetails.dateOfJoining).toLocaleDateString()}</Typography>
                <Typography><strong>Designation:</strong> {userData.employerDetails.designation}</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  </Box>:
    <Box sx={{ width: '100%', padding: 2 }}>
    <Toolbar />
    <CompanyForm onFormFilled={handleCompanyFormFilled} />
    <CustomerForm expanded={!companyData} onCustomerDataChange={handleCustomerDataChange} />
    <Button
      variant="contained"
      color="primary"
      onClick={handleSubmit}
      disabled={!companyData || !customerData}
      sx={{ marginTop: 2 }}
    >
      Submit
    </Button>
  </Box>
  );
};

export default Home;