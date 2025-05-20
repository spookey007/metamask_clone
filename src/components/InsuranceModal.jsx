import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InsuranceModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
              <div className="p-4 sm:p-6 md:p-8 space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 leading-tight">
                  METAMASK INSURANCE PROGRAM
                </h2>
                
                <div className="space-y-3 text-gray-700 text-sm sm:text-base leading-relaxed">
                  <p className="text-justify">
                    Secure your digital assets with the MetaMask Insurance Program — a reliable solution designed to help you recover, back up, or restore access to your MetaMask wallet in the event of loss, theft, or unexpected device failure.
                  </p>
                  
                  <p className="text-justify">
                    With MetaMask, your private keys are encrypted and stored securely on your device.
                  </p>
                  
                  <p className="text-justify">
                    This program adds an extra layer of protection, ensuring you maintain full access and control over your crypto assets at all times.
                  </p>
                  
                  <p className="font-medium text-center">
                    Peace of mind for your Web3 journey. Stay protected. Stay in control.
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-3 px-6 bg-[#9d4edd] text-white rounded-xl hover:bg-[#7b2cbf] transition-colors duration-200 font-medium text-sm sm:text-base shadow-lg hover:shadow-xl active:scale-95"
                >
                  I Understand
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default InsuranceModal; 