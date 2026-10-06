const mongoose = require('mongoose');

const messSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide mess name'],
      trim: true,
      unique: true,
    },
    area: {
      type: String,
      required: [true, 'Please provide area or campus zone'],
      trim: true,
    },
    code: {
      type: String,
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate a clean code if not provided
messSchema.pre('save', function (next) {
  if (!this.code && this.name) {
    this.code = this.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .substring(0, 6);
  }
  next();
});

module.exports = mongoose.model('Mess', messSchema);
