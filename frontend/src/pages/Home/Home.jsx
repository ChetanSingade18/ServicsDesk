import { Box, Toolbar, Button } from '@mui/material';
import React, { useState } from 'react';
import CompanyForm from './components/CompanyForm';
import CustomerForm from './components/CustomerForm';

const Home = ({ userId, token }) => {
  const [companyData, setCompanyData] = useState(null);
  const [customerData, setCustomerData] = useState(null);

  const handleCompanyFormFilled = (data) => {
    setCompanyData(data);
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
        employerDetails:companyData,
        employeeId: customerData.empId,
        mobile: customerData.mobileNumber,
        fullName:customerData.fullName,
        address: customerData.address,
        bloodGroup: customerData.bloodGroup,
        dateOfBirth: customerData.dob,
        userPhotoUrl: customerData.userPhotoPath,
        idPhotoUrl: customerData.idPhotoPath,
      };
      // console.log(updateData,customerData);
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