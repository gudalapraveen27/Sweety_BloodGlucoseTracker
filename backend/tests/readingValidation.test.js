const test = require('node:test');
const assert = require('node:assert/strict');
const { validateReadingInput, isValidDateString } = require('../utils/readingValidation');

const today = new Date().toISOString().slice(0, 10);
const validInput = { date: today, slot: 'After lunch', value: 120 };

test('accepts a valid reading', () => {
  assert.equal(validateReadingInput(validInput), null);
});

test('requires a value and enforces the allowed integer range', () => {
  assert.equal(validateReadingInput({ ...validInput, value: '' }), 'Please enter a glucose value.');
  assert.equal(validateReadingInput({ ...validInput, value: 39 }), 'Value must be between 40 and 600 mg/dl.');
  assert.equal(validateReadingInput({ ...validInput, value: 100.5 }), 'Value must be between 40 and 600 mg/dl.');
});

test('rejects invalid and future dates', () => {
  assert.equal(isValidDateString('2026-02-30'), false);
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  assert.equal(validateReadingInput({ ...validInput, date: tomorrow.toISOString().slice(0, 10) }), 'Date cannot be in the future.');
});

test('rejects an unsupported time slot', () => {
  assert.equal(validateReadingInput({ ...validInput, slot: 'Bedtime' }), 'Please select a valid time slot.');
});
