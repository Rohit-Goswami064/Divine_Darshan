
const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    data: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Content', ContentSchema);
