const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    dateCreated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Section', SectionSchema);
