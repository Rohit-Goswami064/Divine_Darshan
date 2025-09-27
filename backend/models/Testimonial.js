
const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  quote: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Testimonial', TestimonialSchema);
