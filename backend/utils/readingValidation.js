const READING_SLOTS = [
  'Morning (fasting)',
  'After breakfast',
  'After lunch',
  'After dinner'
];

function isValidDateString(date) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === date;
}

function validateReadingInput({ date, slot, value }) {
  if (!isValidDateString(date)) {
    return 'Please enter a valid date.';
  }

  if (date > new Date().toISOString().slice(0, 10)) {
    return 'Date cannot be in the future.';
  }

  if (!READING_SLOTS.includes(slot)) {
    return 'Please select a valid time slot.';
  }

  if (value === undefined || value === null || value === '') {
    return 'Please enter a glucose value.';
  }

  const numberValue = Number(value);
  if (!Number.isInteger(numberValue) || numberValue < 40 || numberValue > 600) {
    return 'Value must be between 40 and 600 mg/dl.';
  }

  return null;
}

module.exports = { READING_SLOTS, isValidDateString, validateReadingInput };
