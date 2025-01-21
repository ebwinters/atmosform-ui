import React, { useState } from 'react';
import { Button, Typography, Container, Box } from '@mui/material';
const BlueskyLogo = require('../logos/bskyLogo.png');

const LoginView: React.FC<{ handleLogin: () => void }> = ({ handleLogin }) => {
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Perform login logic here (e.g., call `handleLogin` with credentials)
    handleLogin();
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          p: 3,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center', // Ensures the heading text is centered
          }}
        >
          Login with Bluesky
          <img src={BlueskyLogo} alt="Bluesky Logo" style={{ height: 24, width: 'auto', marginLeft: 8 }} />
        </Typography>

        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              width: 'auto', // Ensures the button is only as wide as its content
              marginTop: 2, // Adds spacing between the form and the button
              padding: '8px 16px', // Adjust padding for better button appearance
              display: 'block', // Ensures the button takes up only as much space as necessary
              marginLeft: 'auto', // Centers the button horizontally
              marginRight: 'auto', // Centers the button horizontally
            }}
          >
            Log In
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginView;
