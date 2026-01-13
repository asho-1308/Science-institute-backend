const ClassSession = require('../models/ClassSession');

// @desc    Get all class sessions, sorted by start time
// @route   GET /api/classes
// @access  Public
const getClasses = async (req, res) => {
  try {
    // Allow optional filtering by query params: ?category=PERSONAL&day=Monday
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.day) filter.day = req.query.day;
    const classes = await ClassSession.find(filter).sort({ startTime: 1 });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new class session
// @route   POST /api/classes
// @access  Private
const createClass = async (req, res) => {
  // Destructure all relevant fields from the request body
  // Note: frontend sends `type` as 'EXTERNAL' or 'PERSONAL' (which is actually the category).
  // Map accordingly so Mongoose schema enums match.
  const { title, startTime, endTime, location, category, type: incomingType, teacher, classNumber } = req.body;

  // Basic validation
  if (!title || !startTime || !endTime || !location) {
    return res.status(400).json({ message: 'Please provide title, startTime, endTime, and location.' });
  }

  try {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    // Automatically determine the day of the week from the start date
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = days[startDate.getDay()];

    // Check for overlapping classes on the same day
    const overlappingClass = await ClassSession.findOne({
      day,
      $or: [
        { startTime: { $lt: endDate }, endTime: { $gt: startDate } },
      ],
    });

    if (overlappingClass) {
      return res.status(400).json({ 
        message: `Class time overlaps with an existing class: "${overlappingClass.title}"`
      });
    }

    // Map incoming values: if frontend sent type as EXTERNAL/PERSONAL, use that as `category`.
    const categoryFinal = category || (['EXTERNAL', 'PERSONAL'].includes(incomingType) ? incomingType : 'EXTERNAL');
    // Determine class `type` (Theory/Revision/Paper Class). If frontend didn't provide one, default to Theory.
    const typeFinal = ['Theory', 'Revision', 'Paper Class'].includes(incomingType) ? incomingType : 'Theory';

    // Determine classNumber if provided or derive from title (e.g., 'Science - Grade 10')
    const parsedClassNumber = classNumber !== undefined ? Number(classNumber) : (title && (title.match(/\d+/) || [])[0] ? Number((title.match(/\d+/) || [])[0]) : undefined);

    // Create the new class object with defaults
    const newClass = {
      title,
      startTime: startDate,
      endTime: endDate,
      location,
      day,
      category: categoryFinal,
      type: typeFinal,
      teacher: teacher || 'Sir',
      classNumber: parsedClassNumber,
    };

    const classSession = await ClassSession.create(newClass);
    res.status(201).json(classSession);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a class session
// @route   PUT /api/classes/:id
// @access  Private
const updateClass = async (req, res) => {
    const { id } = req.params;
    const { title, startTime, endTime, location, category, type: incomingType, teacher, classNumber } = req.body;

    if (!title || !startTime || !endTime || !location) {
      return res.status(400).json({ message: 'Please provide title, startTime, endTime, and location.' });
    }

    try {
      const startDate = new Date(startTime);
      const endDate = new Date(endTime);

      // determine day from start date before running overlap check
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const day = days[startDate.getDay()];

      // map incoming type/category like in create
      const categoryFinal = category || (['EXTERNAL', 'PERSONAL'].includes(incomingType) ? incomingType : 'EXTERNAL');
      const typeFinal = ['Theory', 'Revision', 'Paper Class'].includes(incomingType) ? incomingType : 'Theory';

      // Overlap check excluding current class and constrained to the same day
      const overlappingClass = await ClassSession.findOne({
        _id: { $ne: id },
        day,
        $or: [
          { startTime: { $lt: endDate }, endTime: { $gt: startDate } },
        ],
      });

      if (overlappingClass) {
        return res.status(400).json({ message: `Class time overlaps with an existing class: "${overlappingClass.title}"` });
      }

      const parsedClassNumber = classNumber !== undefined ? Number(classNumber) : (title && (title.match(/\d+/) || [])[0] ? Number((title.match(/\d+/) || [])[0]) : undefined);

      const updated = await ClassSession.findByIdAndUpdate(
        id,
        {
          title,
          startTime: startDate,
          endTime: endDate,
          location,
          day,
          category: categoryFinal,
          type: typeFinal,
          teacher: teacher || 'Sir',
          classNumber: parsedClassNumber,
        },
        { new: true }
      );

      if (!updated) return res.status(404).json({ message: 'Class not found' });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a class session
// @route   DELETE /api/classes/:id
// @access  Private
const deleteClass = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await ClassSession.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ message: 'Class not found' });
      res.json({ message: 'Class deleted', id: deleted._id });
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
};
