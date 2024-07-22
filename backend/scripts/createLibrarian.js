const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();
const connectDB = require('../config/db');

const createLibrarian = async () => {
    await connectDB();

    try {
        const librarianExists = await User.findOne({ role: 'librarian' });
        if (librarianExists) {
            console.log('Librarian already exists');
            return;
        }

        const { DEFAULT_LIBRARIAN_USERNAME, DEFAULT_LIBRARIAN_PASSWORD, DEFAULT_LIBRARIAN_EMAIL } = process.env;

        const librarian = new User({
            username: DEFAULT_LIBRARIAN_USERNAME,
            password: DEFAULT_LIBRARIAN_PASSWORD,
            email: DEFAULT_LIBRARIAN_EMAIL,
            role: 'librarian'
        });

        const salt = await bcrypt.genSalt(10);
        librarian.password = await bcrypt.hash(librarian.password, salt);

        await librarian.save();
        console.log('Librarian created');
    } catch (err) {
        console.error(err.message);
    } finally {
        mongoose.connection.close();
    }
};

createLibrarian();
