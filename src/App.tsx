import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import LoginView from './components/Login';
import CreateForm from './components/FormCreate'; // Component for creating a form
import 'survey-core/defaultV2.min.css';
import FormPage from './components/FormPage';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import FormList from './components/FormList';
import { Box, Container, CircularProgress } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ResponsePage from './components/ResponsePage';
import { useCheckSessionQuery } from './queries/auth';

const App: React.FC = () => {
  const queryClient = new QueryClient();
  const { error: checkSessionError, isLoading: isCheckSessionLoading } = useCheckSessionQuery();

  if (isCheckSessionLoading) return <Container component="main" maxWidth="xs">
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
      <CircularProgress />
    </Box>
  </Container>;

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div>
          {!checkSessionError ? (
            <>
              <AuthProvider>
                <Header />
                <Routes>
                  <Route path="/login" element={<LoginView />} />
                  <Route path="/create-form" element={<ProtectedRoute element={<CreateForm />} />} />
                  <Route path="/forms/:id/view" element={<ProtectedRoute element={<FormPage readonly={true} shouldPopulateResponseData={false} />} />} />
                  <Route path="/forms/:id/responses" element={<ProtectedRoute element={<ResponsePage readonly={true} shouldPopulateResponseData={true} />} />} />
                  <Route path="/forms/:id" element={<ProtectedRoute element={<FormPage readonly={false} shouldPopulateResponseData={false} />} />} />
                  <Route path="/" element={<ProtectedRoute element={<FormList />} />} />
                </Routes>
              </AuthProvider>
            </>
          ) : (
            <Routes>
              <Route path="/create-form" element={<Navigate to="/" replace />} />
              <Route path="/login" element={<LoginView />} />
              <Route path="/" element={<LoginView />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          )}
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
