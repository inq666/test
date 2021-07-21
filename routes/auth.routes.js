const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = Router();

router.post('/registration',
  check('username').isLength({ min: 3 }).withMessage('Minimum username length 3 characters'),
  check('email').isEmail().withMessage('Invalid email'),
  check('password').isLength({ min: 5 }).withMessage('Minimum password length 5 characters'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessage = errors.array().map((error) => (error.msg)).join('. ');
        return res.status(400).json({ message: errorMessage });
      }
      const { email, password, username } = req.body;
      const isEmailExist = await User.findOne({ email });
      if (isEmailExist) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
      const isUserExist = await User.findOne({ username });
      if (isUserExist) {
        return res.status(400).json({ message: 'User with this username already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email,
        password: hashedPassword,
        username,
      });
      await user.save();
      res.status(201).json({ message: 'User is created' });
    } catch (err) {
      res.status(500).json({ message: 'Internal Server Error', err });
    }
  });

router.post('/login',
  check('email').isEmail().withMessage('Invalid email'),
  check('password').isLength({ min: 5 }).withMessage('Minimum password length 5 characters'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessage = errors.array().map((error) => (error.msg)).join('. ');
        return res.status(400).json({ message: errorMessage });
      }
      const { password, email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: 'User is not found' });
      }
      const isMatch = bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' });
      }

      const token = jwt.sign(
        { userId: user.id },
        'egortest',
        { expiresIn: '24h' },
      );

      res.json({ token, userId: user.id });
    } catch (err) {
      res.status(500).json({ message: 'Internal Server Error', err });
    }
  });

module.exports = router;
