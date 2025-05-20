import React from 'react';
import { motion } from 'framer-motion';
import './Loader.css';

const Loader = () => {
  return (
    <motion.div
      className="loader-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <motion.div
        className="loader-content"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          ease: [0.6, -0.05, 0.01, 0.99]
        }}
      >
        <motion.h1
          className="loader-text"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.4,
            ease: [0.6, -0.05, 0.01, 0.99]
          }}
        >
          MetaMask
        </motion.h1>
      </motion.div>
    </motion.div>
  );
};

export default Loader; 