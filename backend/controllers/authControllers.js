const User = require('../models/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// =================== SIGNUP ===================
exports.signup = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // Validate input
  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or Email already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });
    await user.save();

    // Ensure JWT secret exists
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables.');
      return res.status(500).json({ message: 'Internal server error.' });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Send response with message + user details
    res.status(201).json({
      message: 'Signup successful!',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup.' });
  }
};

// =================== SIGNIN ===================
exports.signin = async (req, res) => {
  const { identifier, password } = req.body;

  // Validate input
  if (!identifier || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Find user by username or email
    const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Check if user has password (for Google OAuth cases)
    if (!user.password) {
      return res.status(400).json({
        message: 'This user has no password set. Please sign in with Google OAuth.',
      });
    }

    // Compare passwords
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Ensure JWT secret exists
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables.');
      return res.status(500).json({ message: 'Internal server error.' });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Send response with message + user details
    res.status(200).json({
      message: 'Signin successful!',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Server error during signin.' });
  }
};

