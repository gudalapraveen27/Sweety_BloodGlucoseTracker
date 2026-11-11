const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function createToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function formatUser(user) {
  return { id: user._id, name: user.name, email: user.email };
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Please enter your name.' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }
    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }
    if (password.length > 72) {
      return res.status(400).json({ message: 'Password must be 72 characters or fewer.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: hashedPassword });
    return res.status(201).json({ token: createToken(user._id.toString()), user: formatUser(user) });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter your email and password.' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    const passwordMatches = user && await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Email or password is incorrect.' });
    }

    return res.json({ token: createToken(user._id.toString()), user: formatUser(user) });
  } catch (error) {
    return next(error);
  }
}

module.exports = { register, login };
