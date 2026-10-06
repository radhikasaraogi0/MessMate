const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'hostelbites_super_secret_jwt_key_2026_secure', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, hostel, roomNumber, role, messId } = req.body;

    if (!name || !email || !password || !hostel || !roomNumber || !messId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields including Mess selection',
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    // Only allow 'student' creation via public register unless explicitly allowed
    const assignedRole = role === 'admin' ? 'admin' : 'student';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      hostel,
      roomNumber,
      role: assignedRole,
      messId,
    });

    const populatedUser = await User.findById(user._id).populate('messId');
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        id: populatedUser._id,
        name: populatedUser.name,
        email: populatedUser.email,
        role: populatedUser.role,
        hostel: populatedUser.hostel,
        roomNumber: populatedUser.roomNumber,
        messId: populatedUser.messId,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password, messId } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    // Check for user
    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+password')
      .populate('messId');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.',
      });
    }

    // If messId was selected in the login form, verify user belongs to that mess
    if (messId) {
      const userMessId = user.messId?._id ? user.messId._id.toString() : user.messId?.toString();
      if (userMessId !== messId.toString()) {
        return res.status(401).json({
          success: false,
          message: `This account is not registered with the selected mess (${user.messId?.name || 'Different Mess'}). Please select your assigned mess.`,
        });
      }
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        hostel: user.hostel,
        roomNumber: user.roomNumber,
        messId: user.messId,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('messId');
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        hostel: user.hostel,
        roomNumber: user.roomNumber,
        messId: user.messId,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
