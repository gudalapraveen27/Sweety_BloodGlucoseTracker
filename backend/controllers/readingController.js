const Reading = require('../models/Reading');
const { validateReadingInput, isValidDateString } = require('../utils/readingValidation');

function toDate(date) {
  return new Date(`${date}T00:00:00.000Z`);
}

function getValidationMessage(error, slot, date) {
  if (error.code !== 11000) {
    return null;
  }
  return `You already have an ${slot} reading for this date (${date}).`;
}

async function listReadings(req, res, next) {
  try {
    const filter = { userId: req.userId };
    if (req.query.date) {
      if (!isValidDateString(req.query.date)) {
        return res.status(400).json({ message: 'Please enter a valid date.' });
      }
      filter.date = toDate(req.query.date);
    }

    const readings = await Reading.find(filter).sort({ date: -1, createdAt: 1 });
    return res.json({ readings });
  } catch (error) {
    return next(error);
  }
}

async function createReading(req, res, next) {
  try {
    const { date, slot, value } = req.body;
    const validationMessage = validateReadingInput({ date, slot, value });
    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }

    const day = toDate(date);
    const count = await Reading.countDocuments({ userId: req.userId, date: day });
    if (count >= 4) {
      return res.status(400).json({ message: 'You can add only 4 readings per day.' });
    }

    const reading = await Reading.create({ userId: req.userId, date: day, slot, value: Number(value) });
    return res.status(201).json({ reading });
  } catch (error) {
    const message = getValidationMessage(error, req.body.slot, req.body.date);
    if (message) {
      return res.status(409).json({ message });
    }
    return next(error);
  }
}

async function updateReading(req, res, next) {
  try {
    const existing = await Reading.findOne({ _id: req.params.id, userId: req.userId });
    if (!existing) {
      return res.status(404).json({ message: 'Reading not found.' });
    }

    const input = {
      date: req.body.date ?? existing.date.toISOString().slice(0, 10),
      slot: req.body.slot ?? existing.slot,
      value: req.body.value ?? existing.value
    };
    const validationMessage = validateReadingInput(input);
    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }

    const date = toDate(input.date);
    const duplicate = await Reading.findOne({
      _id: { $ne: existing._id },
      userId: req.userId,
      date,
      slot: input.slot
    });
    if (duplicate) {
      return res.status(409).json({ message: `You already have an ${input.slot} reading for this date (${input.date}).` });
    }

    existing.date = date;
    existing.slot = input.slot;
    existing.value = Number(input.value);
    await existing.save();
    return res.json({ reading: existing });
  } catch (error) {
    const message = getValidationMessage(error, req.body.slot, req.body.date);
    if (message) {
      return res.status(409).json({ message });
    }
    return next(error);
  }
}

async function deleteReading(req, res, next) {
  try {
    const reading = await Reading.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!reading) {
      return res.status(404).json({ message: 'Reading not found.' });
    }
    return res.json({ message: 'Reading deleted.' });
  } catch (error) {
    return next(error);
  }
}

module.exports = { listReadings, createReading, updateReading, deleteReading };
