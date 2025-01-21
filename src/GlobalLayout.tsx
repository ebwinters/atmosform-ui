import React from 'react';
import { Box } from '@mui/material';
import Header from './components/Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <Box sx={{ marginTop: { xs: '56px', sm: '64px' }, padding: 2 }}>
        {children}
      </Box>
    </>
  );
};

export default Layout;
