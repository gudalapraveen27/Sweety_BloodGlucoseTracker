const express = require('express');
const protect = require('../middleware/authMiddleware');
const {
  listReadings,
  createReading,
  updateReading,
  deleteReading
} = require('../controllers/readingController');

const router = express.Router();
router.use(protect);
router.route('/').get(listReadings).post(createReading);
router.route('/:id').put(updateReading).delete(deleteReading);

module.exports = router;
