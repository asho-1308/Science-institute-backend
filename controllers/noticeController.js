const Notice = require('../models/Notice');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'timetable-app/notices',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }]
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get all notices (public)
const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().populate('createdBy', 'username').sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new notice (admin only)
const createNotice = async (req, res) => {
  try {
    const { title, content, date, type } = req.body;
    const createdBy = req.user._id; // From auth middleware

    const notice = new Notice({
      title,
      content,
      image: req.file ? req.file.path : null, // Cloudinary URL
      date: date || new Date(),
      type: type || 'announcement',
      createdBy
    });

    const savedNotice = await notice.save();
    await savedNotice.populate('createdBy', 'username');
    res.status(201).json(savedNotice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a notice (admin only)
const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, date, type } = req.body;

    const notice = await Notice.findById(id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    notice.title = title || notice.title;
    notice.content = content || notice.content;
    notice.date = date || notice.date;
    notice.type = type || notice.type;

    // Update image if a new file is uploaded
    if (req.file) {
      notice.image = req.file.path; // Cloudinary URL
    }

    const updatedNotice = await notice.save();
    await updatedNotice.populate('createdBy', 'username');
    res.json(updatedNotice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a notice (admin only)
const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await Notice.findByIdAndDelete(id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  upload
};