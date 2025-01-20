// src/components/Header.tsx
import React from 'react';

interface HeaderProps {
  userHandle: string;
}

const Header: React.FC<HeaderProps> = ({ userHandle }) => {
  const headerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
  };

  return (
    <header style={headerStyle}>
      <div className="user-info">
        <p>{userHandle}</p>
      </div>
    </header>
  );
};

export default Header;
