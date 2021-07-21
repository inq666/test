const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'You are not autorization' });
    }

    req.user = jwt.verify(token, 'egortest');
    next();
  } catch (err) {
    console.log('ERROR FROM EXPRESS: ',err);
    res.status(401).json({ message: 'You are not autorization' });
  }
};
