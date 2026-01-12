const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
      if (!process.env.JWT_SECRET) console.warn('Warning: JWT_SECRET not set. Using development fallback secret.');
      const token = jwt.sign({ id: user._id }, secret, {
        expiresIn: '30d',
      });
      res.json({
        _id: user._id,
        username: user.username,
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { authUser };
