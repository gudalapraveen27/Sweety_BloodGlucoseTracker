const express = require('express');
const protect = require('../middleware/authMiddleware');
const { getReports } = require('../controllers/reportController');

const router = express.Router();
router.use(protect);
router.get('/', getReports);

module.exports = router;
