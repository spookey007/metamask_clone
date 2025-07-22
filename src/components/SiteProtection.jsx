import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import GeetestCaptcha from './GeetestCaptcha';

const SiteProtection = ({ onVerified }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [challenge, setChallenge] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTime, setBlockTime] = useState(0);
  const [useGeetest, setUseGeetest] = useState(false);

  // Generate simple math challenge
  const generateMathChallenge = () => {
    const operations = ['+', '-'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    const num1 = Math.floor(Math.random() * 10) + 1; // 1 to 10
    const num2 = Math.floor(Math.random() * 10) + 1; // 1 to 10
    let answer;

    // Ensure positive result for subtraction
    if (operation === '-') {
      answer = num1 - num2;
      if (answer < 0) {
        // Swap numbers if result would be negative
        return {
          question: `${num2} - ${num1} = ?`,
          answer: (num2 - num1).toString(),
          type: 'math'
        };
      }
    } else {
      answer = num1 + num2;
    }

    return {
      question: `${num1} ${operation} ${num2} = ?`,
      answer: answer.toString(),
      type: 'math'
    };
  };

  useEffect(() => {
    // Simulate loading with random delay
    const delay = 1000 + Math.random() * 1000;
    const timer = setTimeout(() => {
      setIsLoading(false);
      setChallenge(generateMathChallenge());
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isBlocked) {
      toast.error(`Please wait ${blockTime} seconds before trying again`);
      return;
    }

    if (userInput === challenge.answer) {
      // Store verification with additional security
      const expiresAt = new Date().getTime() + (12 * 60 * 60 * 1000); // 12 hours
      const verificationData = {
        expiresAt,
        timestamp: new Date().getTime(),
        challengeType: challenge.type
      };
      localStorage.setItem('siteVerified', JSON.stringify(verificationData));
      onVerified();
    } else {
      setAttempts(prev => prev + 1);
      if (attempts >= 2) {
        setIsBlocked(true);
        setBlockTime(30);
        const timer = setInterval(() => {
          setBlockTime(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              setIsBlocked(false);
              setAttempts(0);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
      setChallenge(generateMathChallenge());
      setUserInput('');
      toast.error('Incorrect answer. Please try again.');
    }
  };

  if (useGeetest) {
    return <GeetestCaptcha onVerified={onVerified} />;
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Verifying your browser...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-white flex items-center justify-center"
      >
        <div className="max-w-md w-full mx-4 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Security Check</h2>
          <p className="text-gray-600 text-center mb-6">
            Please solve this simple math problem
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center">
              <p className="text-2xl font-semibold mb-4">{challenge?.question}</p>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-center text-xl"
                placeholder="Enter your answer"
                disabled={isBlocked}
                autoComplete="off"
                spellCheck="false"
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
            
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isBlocked}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                isBlocked ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {isBlocked ? `Please wait ${blockTime}s` : 'Verify'}
            </motion.button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setUseGeetest(true)}
                className="text-purple-600 hover:text-purple-700 text-sm"
              >
                Use Geetest Captcha instead
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SiteProtection; 