const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: String, 
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
