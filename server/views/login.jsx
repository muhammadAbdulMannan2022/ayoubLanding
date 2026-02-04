import React, { useEffect, useState } from 'react';
import { Box, H1, Button, Input, Label, Illustration } from '@adminjs/design-system';

const Login = () => {
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorMessage = params.get('error');
    if (errorMessage) {
      setError(decodeURIComponent(errorMessage));
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  return (
    <Box
      flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bg="bg"
    >
      <Box mb="xxl">
        <img src="/logo.png" alt="Ayoub Landing Logo" width="200" />
      </Box>
      <Box
        as="form"
        action="/admin/login"
        method="POST"
        bg="white"
        p="xxl"
        borderRadius="lg"
        boxShadow="card"
        width={['100%', '100%', '480px']}
      >
        {error && (
          <Box
            bg="danger"
            color="white"
            p="md"
            mb="lg"
            borderRadius="default"
            textAlign="center"
          >
            {error}
          </Box>
        )}
        <Box mb="lg">
          <Label htmlFor="email" required>Email</Label>
          <Input type="email" id="email" name="email" required width="100%" />
        </Box>
        <Box mb="xl">
          <Label htmlFor="password" required>Password</Label>
          <Input type="password" id="password" name="password" required width="100%" />
        </Box>
        <Button type="submit" variant="primary" width="100%" size="lg">
          Log In
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
