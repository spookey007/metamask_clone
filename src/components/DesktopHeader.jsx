import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "/mmask.svg";
import { motion } from "framer-motion";
import WalletConnectModal from '../components/WalletConnectModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DesktopHeader = ({ user, openLModal, handleLogoutClick, closeMenu }) => {
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };
  return (
    <header className="fixed cheader top-10 left-0 right-0 mx-auto max-w-[90%] h-32 bg-white rounded-2xl z-50">
      <div className="flex flex-wrap justify-between items-center px-8 py-8">
        <div className="flex items-center">
        <a href="https://metamask.io" target="_blank" rel="noopener noreferrer">
            <img src={logo} alt="metamask" className="w-24 h-auto" />
          </a>
        </div>
        <nav className="flex space-x-8 text-xl mr-[30%]">
          <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-700 relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-gray-700 after:left-0 after:-bottom-1 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">Features</a>
          <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-700 relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-gray-700 after:left-0 after:-bottom-1 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">Developer</a>
          <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-700 relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-gray-700 after:left-0 after:-bottom-1 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">Cryptocurrencies</a>
        </nav>
        <motion.button
            className="view-metamask-btn"
            variants={itemVariants}
            whileHover={{
              y: -8,
              backgroundColor: '#000',
              color: '#000',
              transition: { duration: 0.5 },
              overflow: 'hidden',
              height: '45px'
            }}
            whileTap={{
              scale: 0.98
            }}
            style={{
              backgroundColor: '#111',
              color: '#fff',
              textDecoration: 'none',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              width: '15%',
              maxWidth: '15%',  
              minHeight: '50px',
              textAlign: 'center',
              position: 'relative',
              borderRadius: '30px',
            }}
            onClick={() => setIsWalletModalOpen(true)}
            onMouseEnter={() => setIsBtnHovered(true)}
            onMouseLeave={() => setIsBtnHovered(false)}
          >
            <motion.span
              animate={{ y: isBtnHovered ? -50 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, restDelta: 0.001 }}
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', width: '100%', height: '100%', position: 'absolute' }}
            >
              VIEW METAMASK WEB
            </motion.span>
            <motion.span
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: isBtnHovered ? 0 : 50, opacity: isBtnHovered ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', width: '100%', height: '100%', position: 'absolute' }}
            >
              VIEW METAMASK WEB
            </motion.span>
          </motion.button>
      </div>

      {/* Wallet Connect Modal */}
      <WalletConnectModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />

      {/* Toast Container */}
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
    </header>
  );
};

export default DesktopHeader;
