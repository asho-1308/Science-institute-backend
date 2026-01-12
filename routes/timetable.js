
const router = require('express').Router();
let Timetable = require('../models/Timetable');

router.route('/').get((req, res) => {
  Timetable.find()
    .then(timetables => res.json(timetables))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const { title, startTime, endTime, location } = req.body;

  const newTimetable = new Timetable({
    title,
    startTime: Date.parse(startTime),
    endTime: Date.parse(endTime),
    location,
  });

  newTimetable.save()
    .then(() => res.json('Timetable added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
