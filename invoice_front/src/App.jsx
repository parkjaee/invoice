import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import StationFileManagement from './components/StationFileManagement';
import UserManagement from './caps/pages/UserManagement';
import WorkStatus from './components/WorkStatus';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/station-files" replace />} />
            <Route path="/station-files" element={<StationFileManagement />} />
            <Route path="/caps/users" element={<UserManagement />} />
            <Route path="/work-status" element={<WorkStatus />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
