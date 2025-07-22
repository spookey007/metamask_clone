import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SiteProtection from './components/SiteProtection';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Check if user is already verified
    const verified = localStorage.getItem('siteVerified');
    if (verified) {
      try {
        const verificationData = JSON.parse(verified);
        const currentTime = new Date().getTime();
        
        // Check if verification is still valid
        if (currentTime < verificationData.expiresAt) {
          // Additional security checks
          const timeSinceVerification = currentTime - verificationData.timestamp;
          const maxAllowedTime = 12 * 60 * 60 * 1000; // 12 hours
          
          if (timeSinceVerification < maxAllowedTime) {
            setIsVerified(true);
          } else {
            localStorage.removeItem('siteVerified');
          }
        } else {
          localStorage.removeItem('siteVerified');
        }
      } catch (error) {
        // If there's any error parsing the verification data, clear it
        localStorage.removeItem('siteVerified');
      }
    }
  }, []);

  if (!isVerified) {
    return <SiteProtection onVerified={() => setIsVerified(true)} />;
  }

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
