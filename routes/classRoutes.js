const express = require('express');
const router = express.Router();
const {
  getClasses,
  createClass,
  updateClass,
  getClassById,
  deleteClass,
} = require('../controllers/classController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getClasses).post(protect, createClass);
router.route('/:id').get(getClassById).put(protect, updateClass).delete(protect, deleteClass);

module.exports = router;
