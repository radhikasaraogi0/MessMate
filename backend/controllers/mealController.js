const Meal = require('../models/Meal');
const Feedback = require('../models/Feedback');
const Mess = require('../models/Mess');
const mongoose = require('mongoose');
const { checkMealFeedbackStatus, getLocalDateString, MEAL_SCHEDULE } = require('../utils/mealTime');

// Meal order mapping for sorting
const MEAL_ORDER = {
  Breakfast: 1,
  Lunch: 2,
  Snacks: 3,
  Dinner: 4,
};

// Helper to determine target messId from query, authenticated user, or first mess default
const getTargetMessId = async (req) => {
  if (req.query.messId) return req.query.messId;
  if (req.user) {
    const userMessId = req.user.messId?._id ? req.user.messId._id : req.user.messId;
    if (userMessId) return userMessId;
  }
  const first = await Mess.findOne().select('_id');
  return first ? first._id : null;
};

// @desc    Get meals for today with average ratings
// @route   GET /api/meals/today
// @access  Public / Authenticated
exports.getTodayMeals = async (req, res, next) => {
  try {
    const today = req.query.date || getLocalDateString();
    const messId = await getTargetMessId(req);

    const mealFilter = { date: today };
    if (messId) {
      mealFilter.messId = messId;
    }

    const meals = await Meal.find(mealFilter).lean();

    // Sort meals by natural day order: Breakfast, Lunch, Snacks, Dinner
    meals.sort((a, b) => (MEAL_ORDER[a.mealType] || 5) - (MEAL_ORDER[b.mealType] || 5));

    // Calculate dynamic rating for each meal from feedback
    const feedbackMatch = { date: today };
    if (messId) {
      feedbackMatch.messId = new mongoose.Types.ObjectId(messId.toString());
    }

    const mealRatings = await Feedback.aggregate([
      { $match: feedbackMatch },
      {
        $group: {
          _id: '$mealType',
          avgRating: { $avg: '$averageRating' },
          feedbackCount: { $sum: 1 },
        },
      },
    ]);

    const ratingMap = {};
    mealRatings.forEach((r) => {
      ratingMap[r._id] = {
        avgRating: Math.round(r.avgRating * 10) / 10,
        feedbackCount: r.feedbackCount,
      };
    });

    const enrichedMeals = meals.map((meal) => {
      const timeStatus = checkMealFeedbackStatus(meal.mealType, meal.date);
      return {
        ...meal,
        avgRating: ratingMap[meal.mealType]?.avgRating || null,
        feedbackCount: ratingMap[meal.mealType]?.feedbackCount || 0,
        isFeedbackOpen: timeStatus.isOpen,
        timingStatus: timeStatus.status,
        timingLabel: timeStatus.label || (timeStatus.isOpen ? 'Open for Review' : `Opens at ${timeStatus.opensAt}`),
        opensAt: timeStatus.opensAt || null,
        servingTime: timeStatus.schedule?.timeRange || null,
      };
    });

    res.status(200).json({
      success: true,
      date: today,
      messId,
      count: enrichedMeals.length,
      data: enrichedMeals,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get weekly mess menu
// @route   GET /api/meals/weekly
// @access  Public / Authenticated
exports.getWeeklyMenu = async (req, res, next) => {
  try {
    const messId = await getTargetMessId(req);

    // Determine start of week (Monday) and end of week (Sunday)
    let baseDate = req.query.startDate ? new Date(req.query.startDate) : new Date();
    if (isNaN(baseDate.getTime())) baseDate = new Date();

    const currentDay = baseDate.getDay(); // 0 is Sunday, 1 is Monday
    const diffToMonday = (currentDay === 0 ? -6 : 1) - currentDay;

    const monday = new Date(baseDate);
    monday.setDate(baseDate.getDate() + diffToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const startStr = getLocalDateString(monday);
    const endStr = getLocalDateString(sunday);

    const mealFilter = {
      date: { $gte: startStr, $lte: endStr },
    };
    if (messId) {
      mealFilter.messId = messId;
    }

    const meals = await Meal.find(mealFilter).sort({ date: 1 }).lean();

    // Group meals by date
    const menuByDate = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateKey = getLocalDateString(d);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
      menuByDate[dateKey] = {
        date: dateKey,
        dayName,
        meals: {
          Breakfast: null,
          Lunch: null,
          Snacks: null,
          Dinner: null,
        },
      };
    }

    meals.forEach((m) => {
      if (menuByDate[m.date]) {
        menuByDate[m.date].meals[m.mealType] = m;
      }
    });

    res.status(200).json({
      success: true,
      messId,
      startDate: startStr,
      endDate: endStr,
      data: Object.values(menuByDate),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all meals with optional date & mealType filter
// @route   GET /api/meals
// @access  Authenticated
exports.getAllMeals = async (req, res, next) => {
  try {
    const messId = await getTargetMessId(req);
    const { date, mealType, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (messId) filter.messId = messId;
    if (date) filter.date = date;
    if (mealType) filter.mealType = mealType;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Meal.countDocuments(filter);
    const meals = await Meal.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    res.status(200).json({
      success: true,
      messId,
      total,
      page: Number(page),
      data: meals,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single meal by ID
// @route   GET /api/meals/:id
// @access  Authenticated
exports.getMealById = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id);
    if (!meal) {
      return res.status(404).json({ success: false, message: 'Meal not found' });
    }
    res.status(200).json({ success: true, data: meal });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new meal (Admin only)
// @route   POST /api/meals
// @access  Private (Admin)
exports.createMeal = async (req, res, next) => {
  try {
    let { date, mealType, items, description, messId } = req.body;

    const targetMessId = messId || (req.user?.messId?._id ? req.user.messId._id : req.user?.messId);

    if (!targetMessId) {
      return res.status(400).json({
        success: false,
        message: 'Mess identification is required to create a meal',
      });
    }

    if (!date || !mealType || !items) {
      return res.status(400).json({
        success: false,
        message: 'Please provide date, mealType, and items',
      });
    }

    // Process items if provided as comma-separated string
    if (typeof items === 'string') {
      items = items
        .split(',')
        .map((i) => i.trim())
        .filter((i) => i.length > 0);
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one food item is required',
      });
    }

    // Check if meal for this date & mealType already exists in this mess
    const existing = await Meal.findOne({ messId: targetMessId, date, mealType });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A ${mealType} menu already exists for ${date} in this mess. You can edit it instead.`,
      });
    }

    const meal = await Meal.create({
      messId: targetMessId,
      date,
      mealType,
      items,
      description: description || '',
    });

    res.status(201).json({
      success: true,
      message: 'Meal created successfully',
      data: meal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a meal (Admin only)
// @route   PUT /api/meals/:id
// @access  Private (Admin)
exports.updateMeal = async (req, res, next) => {
  try {
    let { date, mealType, items, description } = req.body;

    if (items && typeof items === 'string') {
      items = items
        .split(',')
        .map((i) => i.trim())
        .filter((i) => i.length > 0);
    }

    const updateData = {};
    if (date) updateData.date = date;
    if (mealType) updateData.mealType = mealType;
    if (items) updateData.items = items;
    if (description !== undefined) updateData.description = description;

    const meal = await Meal.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!meal) {
      return res.status(404).json({ success: false, message: 'Meal not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Meal updated successfully',
      data: meal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a meal (Admin only)
// @route   DELETE /api/meals/:id
// @access  Private (Admin)
exports.deleteMeal = async (req, res, next) => {
  try {
    const meal = await Meal.findByIdAndDelete(req.params.id);
    if (!meal) {
      return res.status(404).json({ success: false, message: 'Meal not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Meal deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
