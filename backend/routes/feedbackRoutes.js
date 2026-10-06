const express = require('express');
const router = express.Router();
const {
  createFeedback,
  getMyFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
} = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/auth');

// All feedback operations require authentication
router.use(protect);

// Student submits feedback
router.post('/', authorize('student'), createFeedback);

// Student retrieves their own feedback history
router.get('/my-history', authorize('student'), getMyFeedback);

// Admin views all feedback with filtering and searching
router.get('/', authorize('admin'), getAllFeedback);

// Single feedback CRUD
router.get('/:id', getFeedbackById);
router.put('/:id', updateFeedback);
router.delete('/:id', deleteFeedback);

module.exports = router;
