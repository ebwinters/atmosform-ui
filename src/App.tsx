import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Model } from 'survey-core';
import Header from './components/Header';
import LoginView from './components/Login';
import FormsList from './components/FormList'; // Component to display list of forms
import CreateForm from './components/FormCreate'; // Component for creating a form
import 'survey-core/defaultV2.min.css';
import FormPage from './components/FormPage';
import { AuthProvider, useAuth } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import FormList from './components/FormList';

const App: React.FC = () => {

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const handleLogin = async () => {
    const sid = document.cookie.split("; ").find((row) => row.startsWith("sid="));

    if (sid) {
      setIsLoggedIn(true);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:3333/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ handle: "western-red-cedar.bsky.social" }),
      });

      if (response.ok) {
        const { oauthUrl } = await response.json();
        window.location.href = oauthUrl;
      } else {
        console.error("Failed to fetch OAuth URL");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const checkSession = async () => {
    try {
      const response = await fetch('http://127.0.0.1:3333/api/v1/check-session', {
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();

      if (response.ok) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error checking session:', error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);


  return (
    <Router>
      <div>
        {isLoggedIn ? (
          <>
            <AuthProvider>
              <Header />
              <Routes>
                <Route path="/create-form" element={<ProtectedRoute element={<CreateForm />}/>} />
                <Route path="/forms/:id" element={<ProtectedRoute element={<FormPage />}/>} />
                <Route path="/" element={<ProtectedRoute element={<FormList />}/>} />
              </Routes>
            </AuthProvider>
          </>
        ) : (
          <Routes>
            <Route path="/" element={<LoginView handleLogin={handleLogin} />} />
          </Routes>


        )}
      </div>
    </Router>
  );
}

export default App;
