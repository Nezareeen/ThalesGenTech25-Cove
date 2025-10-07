const User = require('../models/auth');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleOAuth = async (req, res) => {
  const { tokenId } = req.body;
  if (!tokenId) return res.status(400).json({ message: 'No token provided' });

  const ticket = await client.verifyIdToken({
    idToken: tokenId,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const { email, name } = payload;

  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ username: name, email, password: '' });
    await user.save();
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
};
