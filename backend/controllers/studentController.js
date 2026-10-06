const User = require('../models/User');
const Feedback = require('../models/Feedback');
const mongoose = require('mongoose');

// @desc    Get all students with submission counts and avg rating (Admin)
// @route   GET /api/admin/students
// @access  Private (Admin)
exports.getAllStudents = async (req, res, next) => {
  try {
    const { search, hostel } = req.query;
    const userMessId = req.user?.messId?._id ? req.user.messId._id : req.user?.messId;

    const query = { role: 'student' };

    if (userMessId) {
      query.messId = userMessId;
    }

    if (hostel) {
      query.hostel = hostel;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { email: regex }, { roomNumber: regex }];
    }

    const students = await User.find(query).sort({ createdAt: -1 }).lean();

    // Aggregate feedback stats per student in this mess
    const feedbackMatch = {};
    if (userMessId) {
      feedbackMatch.messId = new mongoose.Types.ObjectId(userMessId.toString());
    }

    const studentStats = await Feedback.aggregate([
      ...(userMessId ? [{ $match: feedbackMatch }] : []),
      {
        $group: {
          _id: '$studentId',
          feedbackCount: { $sum: 1 },
          avgRating: { $avg: '$averageRating' },
        },
      },
    ]);

    const statsMap = {};
    studentStats.forEach((s) => {
      statsMap[s._id.toString()] = {
        feedbackCount: s.feedbackCount,
        avgRating: Math.round((s.avgRating || 0) * 10) / 10,
      };
    });

    const enrichedStudents = students.map((s) => ({
      _id: s._id,
      name: s.name,
      email: s.email,
      hostel: s.hostel,
      roomNumber: s.roomNumber,
      createdAt: s.createdAt,
      feedbackCount: statsMap[s._id.toString()]?.feedbackCount || 0,
      avgRating: statsMap[s._id.toString()]?.avgRating || null,
    }));

    res.status(200).json({
      success: true,
      count: enrichedStudents.length,
      data: enrichedStudents,
    });
  } catch (error) {
    next(error);
  }
};
