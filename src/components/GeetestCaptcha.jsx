import React, { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

const GeetestCaptcha = ({ onVerified }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Load Geetest script
    const script = document.createElement('script');
    script.src = 'https://static.geetest.com/v4/gt4.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.initGeetest4({
        captchaId: 'YOUR_GEETEST_CAPTCHA_ID', // Replace with your Geetest captcha ID
        language: 'en',
        riskType: 'slide',
        onError: (error) => {
          console.error('Geetest error:', error);
          toast.error('Captcha error. Please try again.');
        }
      }, (captchaObj) => {
        captchaObj.appendTo(containerRef.current);
        captchaObj.onSuccess(() => {
          const expiresAt = new Date().getTime() + (12 * 60 * 60 * 1000); // 12 hours
          const verificationData = {
            expiresAt,
            timestamp: new Date().getTime(),
            challengeType: 'geetest'
          };
          localStorage.setItem('siteVerified', JSON.stringify(verificationData));
          onVerified();
        });
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [onVerified]);

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Security Check</h2>
        <p className="text-gray-600 text-center mb-6">
          Please complete the captcha to continue
        </p>
        <div ref={containerRef} className="flex justify-center"></div>
      </div>
    </div>
  );
};

export default GeetestCaptcha; 