const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    slot: {
      type: String,
      required: true,
      enum: ['Morning (fasting)', 'After breakfast', 'After lunch', 'After dinner']
    },
    value: {
      type: Number,
      required: true,
      min: 40,
      max: 600,
      validate: Number.isInteger
    }
  },
  { timestamps: true }
);

readingSchema.index({ userId: 1, date: 1, slot: 1 }, { unique: true });
readingSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('Reading', readingSchema);
