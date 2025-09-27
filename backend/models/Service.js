
const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    titleKey: { type: String, required: true },
    descriptionKey: { type: String, required: true },
    icon: { type: String, required: true } // Storing the icon name as a string
});

module.exports = mongoose.model('Service', ServiceSchema);
