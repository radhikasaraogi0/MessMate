const express = require('express');
const router = express.Router();
const { getAllStudents } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/', getAllStudents);

module.exports = router;
