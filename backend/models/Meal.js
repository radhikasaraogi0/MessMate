const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: [true, 'Please provide a date in YYYY-MM-DD format'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
    },
    mealType: {
      type: String,
      required: [true, 'Please specify meal type'],
      enum: {
        values: ['Breakfast', 'Lunch', 'Snacks', 'Dinner'],
        message: '{VALUE} is not a supported meal type',
      },
    },
    items: {
      type: [String],
      required: [true, 'Please provide at least one food item'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A meal must contain at least one item',
      },
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    messId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mess',
      required: [true, 'Please specify the mess'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index so a meal type is unique for a given date in a specific mess
mealSchema.index({ messId: 1, date: 1, mealType: 1 }, { unique: true });

module.exports = mongoose.model('Meal', mealSchema);
