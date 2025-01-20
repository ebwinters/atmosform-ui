// src/components/Header.tsx
import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';


const Header: React.FC = () => {
  const headerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    zIndex: 10,
  };

  // Styles for the burger menu and links
  const menuStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: '50px',
    right: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
    zIndex: 10,
  };

  const linkStyle: React.CSSProperties = {
    color: 'white',
    textDecoration: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    marginBottom: '10px',
    transition: 'background-color 0.3s, color 0.3s',
  };

  const linkHoverStyle: React.CSSProperties = {
    ...linkStyle,
    backgroundColor: '#444',
  };


  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Toggle menu visibility
  const toggleMenu = () => setIsMenuOpen((prev: Boolean) => !prev);
  const { authState } = useAuth();

  return (
    <header style={headerStyle}>
      <div className="user-info">
        <p>{authState?.handle}</p>
      </div>
      {/* Burger Icon (3 horizontal lines) */}
      <div onClick={toggleMenu} style={{ cursor: 'pointer' }}>
        <div style={{ width: '30px', height: '4px', backgroundColor: 'white', margin: '5px 0' }}></div>
        <div style={{ width: '30px', height: '4px', backgroundColor: 'white', margin: '5px 0' }}></div>
        <div style={{ width: '30px', height: '4px', backgroundColor: 'white', margin: '5px 0' }}></div>
      </div>

      {/* Burger Menu */}
      {isMenuOpen && (
        <div style={menuStyle}>
          <ul style={{ padding: '0', margin: '0' }}>
            <li>
              <Link to="/" style={linkStyle}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/create-form" style={linkStyle}>
                Create Form
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
