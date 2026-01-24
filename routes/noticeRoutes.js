const express = require('express');
const router = express.Router();
const { getNotices, createNotice, updateNotice, deleteNotice, upload } = require('../controllers/noticeController');
const { protect } = require('../middleware/authMiddleware');

// Public route to get all notices
router.get('/', getNotices);

// Protected routes (admin only)
router.post('/', protect, upload.single('image'), createNotice);
router.put('/:id', protect, upload.single('image'), updateNotice);
router.delete('/:id', protect, deleteNotice);

module.exports = router;