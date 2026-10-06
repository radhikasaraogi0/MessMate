const express = require('express');
const router = express.Router();
const {
  getTodayMeals,
  getWeeklyMenu,
  getAllMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
} = require('../controllers/mealController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

// Public/student-accessible routes
router.get('/today', optionalAuth, getTodayMeals);
router.get('/weekly', optionalAuth, getWeeklyMenu);
router.get('/', optionalAuth, getAllMeals);
router.get('/:id', optionalAuth, getMealById);

// Admin-only management routes
router.post('/', protect, authorize('admin'), createMeal);
router.put('/:id', protect, authorize('admin'), updateMeal);
router.delete('/:id', protect, authorize('admin'), deleteMeal);

module.exports = router;
