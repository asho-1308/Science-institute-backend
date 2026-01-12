const express = require('express');
const router = express.Router();
const {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
} = require('../controllers/classController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getClasses).post(protect, createClass);
router.route('/:id').put(protect, updateClass).delete(protect, deleteClass);

module.exports = router;
