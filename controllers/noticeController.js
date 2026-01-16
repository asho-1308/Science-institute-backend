const Notice = require('../models/Notice');

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
  deleteNotice
};