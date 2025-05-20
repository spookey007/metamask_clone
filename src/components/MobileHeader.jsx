import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "/mmask.svg";
import '@fortawesome/fontawesome-free/css/all.css';
import WalletConnectModal from './WalletConnectModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MobileHeader = ({ user, openLModal, handleLogoutClick, toggleMenu, isMenuOpen, closeMenu }) => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  return (
    <motion.header 
      className="w-full shadow-md bg-white h-16 rounded-2xl"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.5
      }}
    >
      <ToastContainer position="top-right" />
      <div className="px-3 py-1 flex justify-between items-center h-full relative transition-all duration-500 bg-white rounded-2xl">
        <div className="w-2/5 md:w-1/5 lg:w-1/6">
          <a href="https://metamask.io" target="_blank" rel="noopener noreferrer">
            <img src={logo} alt="metamask" className="w-full h-auto max-w-[70px]" />
          </a>
        </div>

        <div className="md:hidden flex items-center justify-center">
          <button 
            onClick={toggleMenu} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 text-white transition-all duration-300 hover:bg-white/30 active:scale-90"
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl transition-all duration-300`}></i>
          </button>
        </div>

      </div>

      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 20,
              duration: 0.5
            }}
            className="fixed top-0 left-0 w-full h-full bg-white shadow-md z-50 rounded-2xl"
          >
            <div className="flex justify-between items-center p-4 border-b border-white/20">
              <a href="https://metamask.io" target="_blank" rel="noopener noreferrer">
                <img src={logo} alt="metamask" className="w-auto h-8" />
              </a>
              <button 
                onClick={toggleMenu} 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-black transition-all duration-300 hover:bg-white/30"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <div className="p-4">
              <ul className="space-y-4">
                <li>
                  <Link 
                    to="https://metamask.io" 
                    onClick={closeMenu} 
                    className="block py-3 px-4 text-black text-lg hover:bg-white/10 rounded-lg transition duration-300"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link 
                    to="https://metamask.io" 
                    onClick={closeMenu} 
                    className="block py-3 px-4 text-black text-lg hover:bg-white/10 rounded-lg transition duration-300"
                  >
                    Developers
                  </Link>
                </li>
                <li>
                  
                  <Link 
                    to="https://metamask.io" 
                    onClick={closeMenu} 
                    className="block py-3 px-4 text-black text-lg hover:bg-white/10 rounded-lg transition duration-300"
                  >
                    Cryptocurrencies
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setIsWalletModalOpen(true);
                      closeMenu();
                    }}
                    className="w-full py-3 px-4 bg-gray-900 text-white text-lg rounded-lg hover:bg-gray-100 transition duration-300"
                  >
                    View Metamask Web
                  </button>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <WalletConnectModal 
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </motion.header>
  );
};

export default MobileHeader;
