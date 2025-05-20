export const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key is required' });
  }

  if (apiKey !== process.env.VITE_API_KEY) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  next();
}; 