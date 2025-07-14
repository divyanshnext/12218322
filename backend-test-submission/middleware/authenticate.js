require('dotenv').config();

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized - Missing or invalid Bearer token' });
  }
  
  const token = authHeader.split(' ')[1]; // Extract token after "Bearer "
  
  if (token !== process.env.AUTH_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }

  next();
};

module.exports = authenticate;
