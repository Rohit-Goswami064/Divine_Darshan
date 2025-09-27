
const mongoose = require('mongoose');

const PujaSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  nameKey: { type: String, required: true },
  descriptionKey: { type: String, required: true },
  price: { type: Number, required: true },
  isEPuja: { type: Boolean, default: false },
  detailsKey: String,
  virtualTourLink: String,
  requirementsKey: String,
});

const PrasadSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    nameKey: { type: String, required: true },
    descriptionKey: { type: String, required: true },
    imageUrl: { type: String, required: true },
    priceMonthly: { type: Number, required: true },
    priceQuarterly: { type: Number, required: true },
});

const FaqSchema = new mongoose.Schema({
  questionKey: { type: String, required: true },
  answerKey: { type: String, required: true },
});

const TempleSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  nameKey: { type: String, required: true },
  locationKey: { type: String, required: true },
  deityKey: { type: String, required: true },
  famousPujaKey: { type: String, required: true },
  imageUrl: { type: String, required: true },
  descriptionKey: { type: String, required: true },
  gallery: [String],
  pujas: [PujaSchema],
  availablePrasads: [PrasadSchema],
  benefitsKey: [String],
  reviewIds: [Number],
  faq: [FaqSchema],
});

module.exports = mongoose.model('Temple', TempleSchema);
