import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/AuthContext'; // Import your AuthProvider and useAuth
import AuthPage from './pages/AuthPage';
import HomePage from './pages/Home';
import Assessment from './pages/SearchPage';
import ToastNotifications from './components/ToastNotifications';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import ProtectedRoute from './components/ProtectedRoute';
import AddCredit from './components/cards/AddCreditsModal';
import Settings from './pages/SettingsPage';
import AssessmentsPage from './pages/AssessmentsPage';
import AssessmentQuiz from './pages/AssessmentQuiz';
import PaymentCancelledScreen from './components/PaymentCancelledScreen';
import PaymentFailedScreen from './components/PaymentFailedScreen';
import PaymentSuccessScreen from './components/PaymentSuccessScreen';
import Dashboard from './pages/Dashboard';
import PasswordChangeScreen from './components/PasswordChangeScreen';
import AllInvoicePage from './pages/AllInvoicePage';
import SOC1Report from './pages/ReportPage'
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<AuthRedirect />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        {/* Protected Routes */}
        <Route path="/assessment" element={<ProtectedRoute component={Assessment} />} />
        <Route path="/add-credits" element={<ProtectedRoute component={AddCredit} />} />
        <Route path='/settings' element={<ProtectedRoute component={Settings} />} />
        <Route path='/assessmentsPage' element={<ProtectedRoute component={AssessmentsPage} />} />
        <Route path='/assessmentsquiz' element={<ProtectedRoute component={AssessmentQuiz} />} />
        <Route path='/purchaseCancel' element={<PaymentCancelledScreen />} />
        <Route path='/purchaseFailed' element={<PaymentFailedScreen />} />
        <Route path='/purchaseSuccess' element={<PaymentSuccessScreen />} />
        <Route path='/dashboard' element={<ProtectedRoute component={Dashboard} />} />
        <Route path='/reset-password' element={<PasswordChangeScreen />} />
        <Route path='/invoices' element={<ProtectedRoute component={AllInvoicePage} />} />
        <Route path='/report' element={<ProtectedRoute component={SOC1Report} />} />

      </Routes>
      <ToastNotifications />
      <ToastContainer /> {/* Include ToastContainer for notifications */}
    </AuthProvider>
  );
}

// Component to handle redirection based on auth state
function AuthRedirect() {
  const { authData, isLoading } = useAuth(); // Get auth data from context
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We can set a loading state to avoid any flash of unstyled content (FOUC)
    if (authData !== null || !isLoading) {
      setLoading(false); // If authData is available or if the loading state is done, stop loading
    }
  }, [authData, isLoading]);

  if (loading) {
    return <div>Loading...</div>; // Optionally add a loading screen or spinner here
  }

  // If logged in, redirect to the assessment page
  if (authData) {
    return <Navigate to="/assessment" replace />;
  }
  
  // If not logged in, show the home page
  return <HomePage />;
}

export default App;
