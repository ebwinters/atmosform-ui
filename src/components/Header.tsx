import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import { useSignOut } from '../queries/auth';
const AtmosformLogo = require('../logos/logo2.png');


const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { authState, setAuthState } = useAuth();
  const navigate = useNavigate();
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const { mutate: signOutMutation } = useSignOut();

  const handleSignOut = async () => {
    try {
      await signOutMutation();
      setAuthState(null);
      handleMenuClose();
      navigate('/login');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  return (
    <AppBar position="fixed" color="primary">
      <Toolbar>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          <img src={AtmosformLogo} alt="Atmosform Logo" style={{ height: 24, width: 'auto', marginLeft: 8, marginRight: 12 }} />
        </Link>
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'left' }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            ATmosform
          </Link>
        </Typography>

        <Typography variant="body1" sx={{ marginRight: 2 }}>
          {authState?.handle}
        </Typography>

        <IconButton
          edge="end"
          color="inherit"
          aria-label="menu"
          onClick={handleMenuOpen}
        >
          <MenuIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose} component={Link} to="/">
            Home
          </MenuItem>
          <MenuItem onClick={handleMenuClose} component={Link} to="/create-form">
            Create Form
          </MenuItem>
          <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

