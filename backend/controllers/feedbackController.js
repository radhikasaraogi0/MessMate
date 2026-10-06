const Feedback = require('../models/Feedback');
const Meal = require('../models/Meal');
const User = require('../models/User');
const mongoose = require('mongoose');
const { checkMealFeedbackStatus, getLocalDateString } = require('../utils/mealTime');

// @desc    Submit new feedback
// @route   POST /api/feedback
// @access  Private (Student)
exports.createFeedback = async (req, res, next) => {
  try {
    const {
      mealId,
      mealType,
      tasteRating,
      qualityRating,
      hygieneRating,
      quantityRating,
      issues,
      comment,
      date,
    } = req.body;

    const userMessId = req.user.messId?._id ? req.user.messId._id : req.user.messId;
    if (!userMessId) {
      return res.status(400).json({
        success: false,
        message: 'Student account is not associated with any mess. Please contact admin.',
      });
    }

    const feedbackDate = date || getLocalDateString();

    if (!mealType || !tasteRating || !qualityRating || !hygieneRating || !quantityRating) {
      return res.status(400).json({
        success: false,
        message: 'Please provide mealType and ratings for taste, quality, hygiene, and quantity (1-5)',
      });
    }

    // Real-Time Meal Verification: Prevent feedback on meals that haven't started yet
    const feedbackStatus = checkMealFeedbackStatus(mealType, feedbackDate);
    if (!feedbackStatus.isOpen) {
      return res.status(400).json({
        success: false,
        message: feedbackStatus.reason,
        locked: true,
        opensAt: feedbackStatus.opensAt,
      });
    }

    // Check if user already submitted feedback for this meal on this date in this mess
    const existing = await Feedback.findOne({
      studentId: req.user.id,
      messId: userMessId,
      mealType,
      date: feedbackDate,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `You have already submitted feedback for ${mealType} on ${feedbackDate}. You can update your existing feedback.`,
        existingFeedbackId: existing._id,
      });
    }

    // Link to Meal in this mess if mealId not passed
    let linkedMealId = mealId;
    if (!linkedMealId) {
      const mealDoc = await Meal.findOne({ messId: userMessId, date: feedbackDate, mealType });
      if (mealDoc) {
        linkedMealId = mealDoc._id;
      }
    }

    const feedback = await Feedback.create({
      studentId: req.user.id,
      messId: userMessId,
      mealId: linkedMealId || null,
      mealType,
      date: feedbackDate,
      tasteRating: Number(tasteRating),
      qualityRating: Number(qualityRating),
      hygieneRating: Number(hygieneRating),
      quantityRating: Number(quantityRating),
      issues: Array.isArray(issues) ? issues : [],
      comment: comment ? comment.trim() : '',
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your feedback has been submitted successfully.',
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current student's feedback history & summary
// @route   GET /api/feedback/my-history
// @access  Private (Student)
exports.getMyFeedback = async (req, res, next) => {
  try {
    const { date, mealType, rating, page = 1, limit = 20 } = req.query;

    const query = { studentId: req.user.id };

    if (date) query.date = date;
    if (mealType) query.mealType = mealType;
    if (rating) {
      const r = Number(rating);
      query.averageRating = { $gte: r, $lt: r + 1 };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [feedbacks, total, summary] = await Promise.all([
      Feedback.find(query)
        .populate('mealId', 'items description')
        .populate('messId', 'name area code')
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Feedback.countDocuments(query),
      Feedback.aggregate([
        { $match: { studentId: new mongoose.Types.ObjectId(req.user.id) } },
        {
          $group: {
            _id: null,
            totalSubmissions: { $sum: 1 },
            avgRating: { $avg: '$averageRating' },
            avgTaste: { $avg: '$tasteRating' },
            avgQuality: { $avg: '$qualityRating' },
            avgHygiene: { $avg: '$hygieneRating' },
            avgQuantity: { $avg: '$quantityRating' },
          },
        },
      ]),
    ]);

    const stats = summary[0] || {
      totalSubmissions: 0,
      avgRating: 0,
      avgTaste: 0,
      avgQuality: 0,
      avgHygiene: 0,
      avgQuantity: 0,
    };

    res.status(200).json({
      success: true,
      data: feedbacks,
      total,
      page: Number(page),
      summary: {
        totalSubmissions: stats.totalSubmissions,
        avgRating: Math.round(stats.avgRating * 10) / 10,
        avgTaste: Math.round(stats.avgTaste * 10) / 10,
        avgQuality: Math.round(stats.avgQuality * 10) / 10,
        avgHygiene: Math.round(stats.avgHygiene * 10) / 10,
        avgQuantity: Math.round(stats.avgQuantity * 10) / 10,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all feedback with filtering, searching, and pagination (Admin)
// @route   GET /api/feedback
// @access  Private (Admin)
exports.getAllFeedback = async (req, res, next) => {
  try {
    const {
      search,
      date,
      mealType,
      rating,
      issue,
      page = 1,
      limit = 20,
    } = req.query;

    const userMessId = req.user.messId?._id ? req.user.messId._id : req.user.messId;
    const query = {};

    if (userMessId) {
      query.messId = userMessId;
    }

    if (date) query.date = date;
    if (mealType) query.mealType = mealType;
    if (rating) {
      const r = Number(rating);
      query.averageRating = { $gte: r, $lt: r + 1 };
    }
    if (issue) {
      query.issues = issue;
    }

    // Text search in comment or student name
    let studentIds = [];
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      const searchFilter = {
        $or: [{ name: searchRegex }, { email: searchRegex }],
      };
      if (userMessId) {
        searchFilter.messId = userMessId;
      }
      const matchedUsers = await User.find(searchFilter).select('_id');

      studentIds = matchedUsers.map((u) => u._id);

      query.$or = [
        { comment: searchRegex },
        { studentId: { $in: studentIds } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [feedbacks, total] = await Promise.all([
      Feedback.find(query)
        .populate('studentId', 'name email hostel roomNumber')
        .populate('mealId', 'items description')
        .populate('messId', 'name area code')
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Feedback.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: feedbacks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single feedback by ID
// @route   GET /api/feedback/:id
// @access  Private
exports.getFeedbackById = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('studentId', 'name email hostel roomNumber')
      .populate('mealId', 'items description')
      .populate('messId', 'name area code');

    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }

    // Students can only view their own feedback, Admins can view feedback belonging to their mess
    if (req.user.role !== 'admin' && feedback.studentId._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    next(error);
  }
};

// @desc    Update feedback
// @route   PUT /api/feedback/:id
// @access  Private (Owner student or Admin)
exports.updateFeedback = async (req, res, next) => {
  try {
    let feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }

    // Verify ownership
    if (
      req.user.role !== 'admin' &&
      feedback.studentId.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this feedback',
      });
    }

    const {
      tasteRating,
      qualityRating,
      hygieneRating,
      quantityRating,
      issues,
      comment,
    } = req.body;

    if (tasteRating !== undefined) feedback.tasteRating = Number(tasteRating);
    if (qualityRating !== undefined) feedback.qualityRating = Number(qualityRating);
    if (hygieneRating !== undefined) feedback.hygieneRating = Number(hygieneRating);
    if (quantityRating !== undefined) feedback.quantityRating = Number(quantityRating);
    if (issues !== undefined) feedback.issues = Array.isArray(issues) ? issues : [];
    if (comment !== undefined) feedback.comment = comment.trim();

    await feedback.save();

    res.status(200).json({
      success: true,
      message: 'Feedback updated successfully',
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private (Owner student or Admin)
exports.deleteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }

    // Verify ownership
    if (
      req.user.role !== 'admin' &&
      feedback.studentId.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this feedback',
      });
    }

    await Feedback.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
