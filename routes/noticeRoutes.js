const express = require('express');
const router = express.Router();
const { getNotices, createNotice, updateNotice, deleteNotice } = require('../controllers/noticeController');
const { protect } = require('../middleware/authMiddleware');

// Public route to get all notices
router.get('/', getNotices);

// Protected routes (admin only)
router.post('/', protect, createNotice);
router.put('/:id', protect, updateNotice);
router.delete('/:id', protect, deleteNotice);

module.exports = router;