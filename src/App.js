// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/AuthContext'; // Import your AuthProvider and useAuth
import AuthPage from './pages/AuthPage';
import HomePage from './pages/Home';
import Assessment from './pages/SearchPage';
import ToastNotifications from './components/ToastNotifications';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import ProtectedRoute from './components/ProtectedRoute';
import AddCredit from './components/cards/AddCreditsModal';
import Settings from './pages/SettingsPage'
import AssessmentsPage from './pages/AssessmentsPage';
import AssessmentQuiz from './pages/AssessmentQuiz';
import PaymentCancelledScreen from './components/PaymentCancelledScreen';
import PaymentFailedScreen from './components/PaymentFailedScreen';
import PaymentSuccessScreen from './components/PaymentSuccessScreen';
import Dashboard from './components/Dashboard';
import PasswordChangeScreen from './components/PasswordChangeScreen';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AuthRedirect />} />
          {/* <Route path='/' element={<HomePage/>}/> */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/assessment" element={<ProtectedRoute component={Assessment} />} />
          <Route path="/add-credits" element={<ProtectedRoute component={AddCredit} />} />
          <Route path='/settings' element={<Settings/>}/>
          <Route path='/assessmentsPage' element={<AssessmentsPage/>}/>
          <Route path='/assessmentsquiz' element={<AssessmentQuiz/>}/>
          <Route path='/purchaseCancel' element={<PaymentCancelledScreen/>}/>
          <Route path='/purchaseFailed' element={<PaymentFailedScreen/>}/>
          <Route path='/purchaseSuccess' element={<PaymentSuccessScreen/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/forgotpassword' element={<PasswordChangeScreen/>}/>


        </Routes>
        <ToastNotifications />    
        <ToastContainer /> {/* Include ToastContainer for notifications */}
      </Router>
    </AuthProvider>
  );
}

// Component to handle redirection based on auth state
function AuthRedirect() {
  const { authData } = useAuth(); // Get auth data from context

  // If logged in, redirect to assessment page
  if (authData) {
    return <Navigate to="/assessment" replace />;
  }
  
  // If not logged in, show the home page
  return <HomePage />;
}

export default App;
