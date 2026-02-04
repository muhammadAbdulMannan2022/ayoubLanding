import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Loader } from '@adminjs/design-system';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the Hero resource list page immediately
    navigate('/resources/Hero');
  }, [navigate]);

  return (
    <Box
      flex
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <Loader />
    </Box>
  );
};

export default Dashboard;
