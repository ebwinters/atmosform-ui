import React, { useState } from 'react';
import { Button, Typography, Container, Box, FormControl, TextField } from '@mui/material';
import { useCheckSessionQuery } from '../queries/auth';
const BlueskyLogo = require('../logos/bskyLogo.png');

const LoginView: React.FC<{ handleLogin: (handle: string) => void }> = ({ handleLogin }) => {
  const [error, setError] = useState('');
  const { error: checkSessionError, isLoading: isCheckSessionLoading } = useCheckSessionQuery();

  const [handle, setHandle] = useState<string>('');

  if (!isCheckSessionLoading && !checkSessionError) {
    console.log('hi')
    //naviage home to /
    window.location.href = '/';
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHandle(event.target.value);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handle.trim()) {
      handleLogin(handle);
    }
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

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Handle"
              variant="outlined"
              value={handle}
              onChange={handleChange}
              fullWidth
              error={!!error}
              helperText={error}
              autoFocus
            />
          </FormControl>
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
