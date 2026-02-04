import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Box, Loader } from "@adminjs/design-system";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Redirecting to /admin/resources/hero");
    navigate("/admin/resources/hero");
  }, [navigate]);

  return (
    <Box flex justifyContent="center" alignItems="center" height="100%">
      <Navigate to="/admin/resources/hero" replace />
    </Box>
  );
};

export default Dashboard;
