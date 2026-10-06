const Mess = require('../models/Mess');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Get all registered messes
// @route   GET /api/messes
// @access  Public
exports.getAllMesses = async (req, res) => {
  try {
    const messes = await Mess.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: messes.length,
      data: messes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messes',
      error: error.message,
    });
  }
};

// @desc    Get mess by ID
// @route   GET /api/messes/:id
// @access  Public
exports.getMessById = async (req, res) => {
  try {
    const mess = await Mess.findById(req.params.id);
    if (!mess) {
      return res.status(404).json({
        success: false,
        message: 'Mess not found',
      });
    }
    res.status(200).json({
      success: true,
      data: mess,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mess details',
      error: error.message,
    });
  }
};

// @desc    Register a new mess and its primary admin authority
// @route   POST /api/messes
// @access  Public
exports.registerMess = async (req, res) => {
  try {
    const {
      messName,
      area,
      description,
      adminName,
      adminEmail,
      adminPassword,
      hostel,
      roomNumber,
    } = req.body;

    if (!messName || !area) {
      return res.status(400).json({
        success: false,
        message: 'Mess name and area are required',
      });
    }

    if (!adminName || !adminEmail || !adminPassword) {
      return res.status(400).json({
        success: false,
        message: 'Admin name, email, and password are required to register a mess',
      });
    }

    // Check if mess name exists
    const existingMess = await Mess.findOne({ name: { $regex: new RegExp(`^${messName.trim()}$`, 'i') } });
    if (existingMess) {
      return res.status(400).json({
        success: false,
        message: 'A mess with this name already exists',
      });
    }

    // Check if admin email exists
    const existingUser = await User.findOne({ email: adminEmail.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // Create the mess
    const mess = await Mess.create({
      name: messName.trim(),
      area: area.trim(),
      description: description ? description.trim() : '',
    });

    // Create admin user associated with this mess
    const admin = await User.create({
      name: adminName.trim(),
      email: adminEmail.toLowerCase().trim(),
      password: adminPassword,
      role: 'admin',
      hostel: hostel ? hostel.trim() : area.trim(),
      roomNumber: roomNumber ? roomNumber.trim() : 'Mess Office',
      messId: mess._id,
    });

    const token = generateToken(admin._id);

    res.status(201).json({
      success: true,
      message: 'Mess and administrative account created successfully',
      data: {
        mess,
        user: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          hostel: admin.hostel,
          roomNumber: admin.roomNumber,
          messId: mess,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to register new mess',
      error: error.message,
    });
  }
};
