import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Model } from 'survey-core';
import Header from './components/Header';
import LoginView from './components/Login';
import FormsList from './components/FormList'; // Component to display list of forms
import CreateForm from './components/FormCreate'; // Component for creating a form
import 'survey-core/defaultV2.min.css';
import FormPage from './components/FormPage';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userHandle, setUserHandle] = useState<string | null>(null);
  const [userDid, setUserDid] = useState<string | null>(null);

  const alertResults = useCallback((sender: any) => {
    console.log("SENDER", sender.data);
    console.log("DATA", sender.getPlainData());
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('http://127.0.0.1:3333/api/v1/check-session', {
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();

      if (response.ok) {
        setIsLoggedIn(true);
        setUserHandle(data.handle); // Assuming the response includes the handle
        setUserDid(data.did);       // Assuming the response includes the DID
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

  return (
    <Router>
      <div>
        {isLoggedIn ? (
          <>
            <Header userHandle={userHandle || 'Unknown'} />
            <Routes>
              <Route path="/forms/:id" element={<FormPage />} />
              <Route path="/create-form" element={<CreateForm />} />
              <Route path="/"  element={<FormsList />} />
            </Routes>
          </>
        ) : (
          <LoginView handleLogin={handleLogin} />
        )}
      </div>
    </Router>
  );
}

export default App;
