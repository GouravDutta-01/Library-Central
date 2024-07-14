const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['librarian', 'user'], default: 'user' },
    requestedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ebook' }],
    issuedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ebook' }],
    feedback: [
        {
            ebook: { type: mongoose.Schema.Types.ObjectId, ref: 'Ebook' },
            rating: { type: Number, required: true },
            comment: { type: String, required: true }
        }
    ]
});

module.exports = mongoose.model('User', UserSchema);
