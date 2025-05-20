import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Model3D from '../components/Model3D';
import WalletConnectModal from '../components/WalletConnectModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InsuranceModal from '../components/InsuranceModal';

const Home = () => {
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show modal immediately after component mounts
    setIsLoading(false);
    setIsInsuranceModalOpen(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        staggerChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

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
    <motion.div 
      className="home"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <ToastContainer position="top-right" />
      <Header />
      <main>
        <section className="hero">
          <motion.h1
            variants={itemVariants}
            style={{
              marginTop: '15vh',
              textDecoration: 'none',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              minHeight: '100%',
              textAlign: 'center',
              position: 'relative'
            }}
            className="web3-title font-mm-poly-variable"
          >
            Your home in web3
          </motion.h1>
          <motion.a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsWalletModalOpen(true);
            }}
            className="view-metamask-btn"
            variants={itemVariants}
            whileHover={{
              y: -8,
              backgroundColor: '#fff',
              color: '#111',
              transition: { duration: 0.5 },
              overflow: 'hidden'
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
              width: '100%',
              maxWidth: '300px',
              minHeight: '50px',
              textAlign: 'center',
              position: 'relative',
              zIndex: 1
            }}
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
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#000', width: '100%', height: '100%', position: 'absolute' }}
            >
              VIEW METAMASK WEB
            </motion.span>
          </motion.a>
          
          <motion.div
            variants={itemVariants}
            style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '2rem' }}
          >
          </motion.div>
          <Model3D />
        </section>
      </main>
      
      <WalletConnectModal 
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
      
      <InsuranceModal 
        isOpen={isInsuranceModalOpen} 
        onClose={() => setIsInsuranceModalOpen(false)} 
      />
      
      {/* <Footer /> */}
    </motion.div>
  );
};

export default Home;
