const express = require('express');
const router = express.Router();
const {
  getOverview,
  getMealRatings,
  getRatingTrend,
  getIssuesBreakdown,
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

// All analytics require admin authorization
router.use(protect, authorize('admin'));

router.get('/overview', getOverview);
router.get('/meal-ratings', getMealRatings);
router.get('/rating-trend', getRatingTrend);
router.get('/issues', getIssuesBreakdown);

module.exports = router;
