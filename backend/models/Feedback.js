const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required'],
    },
    mealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meal',
      default: null,
    },
    mealType: {
      type: String,
      required: [true, 'Meal type is required'],
      enum: ['Breakfast', 'Lunch', 'Snacks', 'Dinner'],
    },
    date: {
      type: String,
      required: true,
      default: () => new Date().toISOString().split('T')[0],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
    },
    tasteRating: {
      type: Number,
      required: [true, 'Taste rating is required'],
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating must be between 1 and 5'],
    },
    qualityRating: {
      type: Number,
      required: [true, 'Quality rating is required'],
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating must be between 1 and 5'],
    },
    hygieneRating: {
      type: Number,
      required: [true, 'Hygiene rating is required'],
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating must be between 1 and 5'],
    },
    quantityRating: {
      type: Number,
      required: [true, 'Quantity rating is required'],
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating must be between 1 and 5'],
    },
    averageRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    issues: {
      type: [String],
      default: [],
      enum: [
        'Too spicy',
        'Too salty',
        'Too oily',
        'Food was cold',
        'Poor quality',
        'Less quantity',
        'Poor variety',
        'No issue',
        'Other',
      ],
    },
    comment: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
    messId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mess',
      required: [true, 'Mess ID is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate averageRating
feedbackSchema.pre('save', function (next) {
  const sum =
    this.tasteRating +
    this.qualityRating +
    this.hygieneRating +
    this.quantityRating;
  this.averageRating = Math.round((sum / 4) * 10) / 10;
  next();
});

// Index for high performance aggregation queries
feedbackSchema.index({ messId: 1, date: 1, mealType: 1 });
feedbackSchema.index({ messId: 1, createdAt: -1 });
feedbackSchema.index({ studentId: 1, createdAt: -1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
