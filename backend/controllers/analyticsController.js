const Feedback = require('../models/Feedback');
const User = require('../models/User');
const Meal = require('../models/Meal');
const mongoose = require('mongoose');

const getLocalDateString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getAdminMessObjectId = (req) => {
  const userMessId = req.user?.messId?._id ? req.user.messId._id : req.user?.messId;
  return userMessId ? new mongoose.Types.ObjectId(userMessId.toString()) : null;
};

// @desc    Get system overview statistics (Admin)
// @route   GET /api/admin/analytics/overview
// @access  Private (Admin)
exports.getOverview = async (req, res, next) => {
  try {
    const messObjectId = getAdminMessObjectId(req);
    const userMessId = req.user?.messId?._id || req.user?.messId;

    const userFilter = { role: 'student' };
    const feedbackFilter = {};
    const mealFilter = {};
    const feedbackMatch = {};

    if (userMessId) {
      userFilter.messId = userMessId;
      feedbackFilter.messId = userMessId;
      mealFilter.messId = userMessId;
      feedbackMatch.messId = messObjectId;
    }

    const ratingAggPipeline = [];
    if (messObjectId) ratingAggPipeline.push({ $match: feedbackMatch });
    ratingAggPipeline.push({
      $group: {
        _id: null,
        avgRating: { $avg: '$averageRating' },
        avgTaste: { $avg: '$tasteRating' },
        avgQuality: { $avg: '$qualityRating' },
        avgHygiene: { $avg: '$hygieneRating' },
        avgQuantity: { $avg: '$quantityRating' },
      },
    });

    const issuesAggPipeline = [];
    if (messObjectId) issuesAggPipeline.push({ $match: feedbackMatch });
    issuesAggPipeline.push(
      { $unwind: '$issues' },
      { $match: { issues: { $nin: ['No issue', ''] } } },
      { $count: 'totalIssues' }
    );

    const [totalStudents, totalFeedback, ratingAgg, issuesAgg, totalMeals] = await Promise.all([
      User.countDocuments(userFilter),
      Feedback.countDocuments(feedbackFilter),
      Feedback.aggregate(ratingAggPipeline),
      Feedback.aggregate(issuesAggPipeline),
      Meal.countDocuments(mealFilter),
    ]);

    const stats = ratingAgg[0] || {
      avgRating: 0,
      avgTaste: 0,
      avgQuality: 0,
      avgHygiene: 0,
      avgQuantity: 0,
    };

    const totalIssues = issuesAgg[0]?.totalIssues || 0;

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalFeedback,
        averageRating: Math.round((stats.avgRating || 0) * 10) / 10,
        totalIssues,
        totalMeals,
        breakdown: {
          taste: Math.round((stats.avgTaste || 0) * 10) / 10,
          quality: Math.round((stats.avgQuality || 0) * 10) / 10,
          hygiene: Math.round((stats.avgHygiene || 0) * 10) / 10,
          quantity: Math.round((stats.avgQuantity || 0) * 10) / 10,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get average ratings grouped by meal type
// @route   GET /api/admin/analytics/meal-ratings
// @access  Private (Admin)
exports.getMealRatings = async (req, res, next) => {
  try {
    const mealOrder = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];
    const messObjectId = getAdminMessObjectId(req);

    const pipeline = [];
    if (messObjectId) {
      pipeline.push({ $match: { messId: messObjectId } });
    }
    pipeline.push({
      $group: {
        _id: '$mealType',
        averageRating: { $avg: '$averageRating' },
        avgTaste: { $avg: '$tasteRating' },
        avgQuality: { $avg: '$qualityRating' },
        avgHygiene: { $avg: '$hygieneRating' },
        avgQuantity: { $avg: '$quantityRating' },
        count: { $sum: 1 },
      },
    });

    const agg = await Feedback.aggregate(pipeline);

    const aggMap = {};
    agg.forEach((item) => {
      aggMap[item._id] = {
        meal: item._id,
        averageRating: Math.round((item.averageRating || 0) * 10) / 10,
        taste: Math.round((item.avgTaste || 0) * 10) / 10,
        quality: Math.round((item.avgQuality || 0) * 10) / 10,
        hygiene: Math.round((item.avgHygiene || 0) * 10) / 10,
        quantity: Math.round((item.avgQuantity || 0) * 10) / 10,
        count: item.count,
      };
    });

    const result = mealOrder.map((meal) => {
      return (
        aggMap[meal] || {
          meal,
          averageRating: 0,
          taste: 0,
          quality: 0,
          hygiene: 0,
          quantity: 0,
          count: 0,
        }
      );
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get daily rating trends for last N days (default: 7)
// @route   GET /api/admin/analytics/rating-trend
// @access  Private (Admin)
exports.getRatingTrend = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days, 10) || 7;
    const messObjectId = getAdminMessObjectId(req);

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - (days - 1));

    const startStr = getLocalDateString(startDate);
    const endStr = getLocalDateString(endDate);

    const matchStage = {
      date: { $gte: startStr, $lte: endStr },
    };
    if (messObjectId) {
      matchStage.messId = messObjectId;
    }

    const agg = await Feedback.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$date',
          averageRating: { $avg: '$averageRating' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const aggMap = {};
    agg.forEach((item) => {
      aggMap[item._id] = {
        averageRating: Math.round((item.averageRating || 0) * 10) / 10,
        count: item.count,
      };
    });

    // Fill each day in continuous date sequence
    const trend = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateKey = getLocalDateString(d);
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      const displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      trend.push({
        date: dateKey,
        day: dayLabel,
        displayDate: `${dayLabel} (${displayDate})`,
        averageRating: aggMap[dateKey]?.averageRating || 0,
        count: aggMap[dateKey]?.count || 0,
      });
    }

    res.status(200).json({
      success: true,
      days,
      startDate: startStr,
      endDate: endStr,
      data: trend,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get frequency of reported issues
// @route   GET /api/admin/analytics/issues
// @access  Private (Admin)
exports.getIssuesBreakdown = async (req, res, next) => {
  try {
    const messObjectId = getAdminMessObjectId(req);

    const pipeline = [];
    if (messObjectId) {
      pipeline.push({ $match: { messId: messObjectId } });
    }
    pipeline.push(
      { $unwind: '$issues' },
      {
        $match: {
          issues: { $nin: ['No issue', ''] },
        },
      },
      {
        $group: {
          _id: '$issues',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } }
    );

    const agg = await Feedback.aggregate(pipeline);

    const allPredefinedIssues = [
      'Too spicy',
      'Too salty',
      'Too oily',
      'Food was cold',
      'Poor quality',
      'Less quantity',
      'Poor variety',
      'Other',
    ];

    const countMap = {};
    agg.forEach((item) => {
      countMap[item._id] = item.count;
    });

    const totalIssues = agg.reduce((acc, curr) => acc + curr.count, 0);

    const result = allPredefinedIssues
      .map((issue) => ({
        issue,
        count: countMap[issue] || 0,
        percentage: totalIssues > 0 ? Math.round(((countMap[issue] || 0) / totalIssues) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    res.status(200).json({
      success: true,
      totalIssues,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
