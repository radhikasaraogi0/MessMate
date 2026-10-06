const express = require('express');
const router = express.Router();
const {
  getAllMesses,
  getMessById,
  registerMess,
} = require('../controllers/messController');

router.route('/')
  .get(getAllMesses)
  .post(registerMess);

router.route('/:id')
  .get(getMessById);

module.exports = router;
