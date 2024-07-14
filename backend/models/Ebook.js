const mongoose = require('mongoose');

const EbookSchema = new mongoose.Schema({
    name: { type: String, required: true },
    content: { type: String, required: true },
    authors: { type: [String], required: true },
    section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
    dateIssued: { type: Date },
    returnDate: { type: Date },
    issuedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Ebook', EbookSchema);
