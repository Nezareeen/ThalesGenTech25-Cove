const User = require('../models/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// basic transporter factory (uses SMTP settings from env)
function makeTransporter() {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

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
    // generate verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();

    // send verification email if SMTP configured
    const transporter = makeTransporter();
    if (transporter && process.env.CLIENT_URL) {
      const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: email,
          subject: 'Verify your email',
          text: `Please verify your email by visiting: ${verifyUrl}`,
          html: `<p>Please verify your email by clicking <a href="${verifyUrl}">here</a></p>`,
        });
      } catch (err) {
        console.error('Failed to send verification email:', err.message || err);
      }
    }

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

// =================== FORGOT PASSWORD ===================
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required.' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'No user with that email.' });

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const transporter = makeTransporter();
    if (!transporter || !process.env.CLIENT_URL) {
      return res.status(200).json({ message: 'Password reset token generated.', resetToken: token });
    }

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'Password reset',
      text: `Reset your password: ${resetUrl}`,
      html: `<p>Reset your password by clicking <a href="${resetUrl}">here</a></p>`,
    });

    res.status(200).json({ message: 'Password reset email sent if the address exists.' });
  } catch (err) {
    console.error('forgotPassword error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// =================== RESET PASSWORD ===================
exports.resetPassword = async (req, res) => {
  const { email, token, password, confirmPassword } = req.body;
  if (!email || !token || !password || !confirmPassword) return res.status(400).json({ message: 'All fields required.' });
  if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match.' });
  try {
    const user = await User.findOne({ email, resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token.' });
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(200).json({ message: 'Password has been reset.' });
  } catch (err) {
    console.error('resetPassword error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// =================== CHANGE PASSWORD ===================
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Missing authorization header.' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Invalid authorization header.' });
  if (!oldPassword || !newPassword || !confirmPassword) return res.status(400).json({ message: 'All fields required.' });
  if (newPassword !== confirmPassword) return res.status(400).json({ message: 'New passwords do not match.' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (!user.password) return res.status(400).json({ message: 'No password set for this account.' });
    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) return res.status(401).json({ message: 'Old password incorrect.' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (err) {
    console.error('changePassword error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// =================== LOGOUT ===================
// With JWT, logout is typically client-side (drop token). Provide an endpoint to help client clear cookies if used.
exports.logout = async (req, res) => {
  // If tokens are stored in cookies, clear them. Otherwise client should delete the token.
  res.clearCookie && res.clearCookie('token');
  res.status(200).json({ message: 'Logged out.' });
};

// =================== EMAIL VERIFICATION ===================
exports.verifyEmail = async (req, res) => {
  const { token, email } = req.body;
  if (!token || !email) return res.status(400).json({ message: 'Token and email required.' });
  try {
    const user = await User.findOne({ email, verificationToken: token });
    if (!user) return res.status(400).json({ message: 'Invalid token or email.' });
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    res.status(200).json({ message: 'Email verified.' });
  } catch (err) {
    console.error('verifyEmail error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// helper to resend verification
exports.resendVerification = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required.' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'No user found.' });
    if (user.isVerified) return res.status(400).json({ message: 'Already verified.' });
    const token = crypto.randomBytes(20).toString('hex');
    user.verificationToken = token;
    await user.save();
    const transporter = makeTransporter();
    if (!transporter || !process.env.CLIENT_URL) return res.status(200).json({ message: 'Verification token generated.', token });
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'Verify your email',
      text: `Please verify your email by visiting: ${verifyUrl}`,
      html: `<p>Please verify your email by clicking <a href="${verifyUrl}">here</a></p>`,
    });
    res.status(200).json({ message: 'Verification email sent.' });
  } catch (err) {
    console.error('resendVerification error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

