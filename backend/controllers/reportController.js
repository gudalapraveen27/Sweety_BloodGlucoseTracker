const Reading = require('../models/Reading');
const { isValidDateString } = require('../utils/readingValidation');

function utcDate(date) {
  return new Date(`${date}T00:00:00.000Z`);
}

function summarize(readings, start, end) {
  const values = readings.map((reading) => reading.value);
  return {
    start,
    end,
    count: values.length,
    highest: values.length ? Math.max(...values) : null,
    lowest: values.length ? Math.min(...values) : null,
    average: values.length
      ? Math.round((values.reduce((total, value) => total + value, 0) / values.length) * 10) / 10
      : null,
    readings
  };
}

async function getReports(req, res, next) {
  try {
    const selectedDate = req.query.date || new Date().toISOString().slice(0, 10);
    if (!isValidDateString(selectedDate)) {
      return res.status(400).json({ message: 'Please enter a valid date.' });
    }

    const [year, month] = selectedDate.split('-').map(Number);
    const dailyStart = utcDate(selectedDate);
    const nextDay = new Date(dailyStart);
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);
    const monthStart = new Date(Date.UTC(year, month - 1, 1));
    const previousMonthStart = new Date(Date.UTC(year, month - 2, 1));
    const previousMonthEnd = new Date(Date.UTC(year, month - 1, 1));
    const previousMonthLastDay = new Date(Date.UTC(year, month - 1, 0)).toISOString().slice(0, 10);
    const monthEnd = nextDay;

    const [dailyReadings, monthReadings, previousReadings] = await Promise.all([
      Reading.find({ userId: req.userId, date: { $gte: dailyStart, $lt: nextDay } }).sort({ createdAt: 1 }),
      Reading.find({ userId: req.userId, date: { $gte: monthStart, $lt: monthEnd } }).sort({ date: 1, createdAt: 1 }),
      Reading.find({ userId: req.userId, date: { $gte: previousMonthStart, $lt: previousMonthEnd } }).sort({ date: 1, createdAt: 1 })
    ]);

    return res.json({
      selectedDate,
      daily: summarize(dailyReadings, selectedDate, selectedDate),
      monthToDate: summarize(monthReadings, `${year}-${String(month).padStart(2, '0')}-01`, selectedDate),
      monthly: summarize(previousReadings, previousMonthStart.toISOString().slice(0, 10), previousMonthLastDay)
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getReports };
