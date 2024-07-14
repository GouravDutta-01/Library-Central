const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Ebook = require('../models/Ebook');
const Section = require('../models/Section');

// Search Sections and E-books
router.get('/sections', auth, async (req, res) => {
    try {
        const sections = await Section.find();
        res.json(sections);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/ebooks', auth, async (req, res) => {
    try {
        const ebooks = await Ebook.find().populate('section');
        res.json(ebooks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Request/Return E-book
router.post('/ebooks/:id/request', auth, async (req, res) => {
    const userId = req.user.id;
    try {
        let ebook = await Ebook.findById(req.params.id);
        if (!ebook) {
            return res.status(404).json({ msg: 'E-book not found' });
        }

        let user = await User.findById(userId);
        if (user.issuedBooks.length >= 5) {
            return res.status(400).json({ msg: 'You have already requested 5 e-books' });
        }

        if (ebook.issuedTo) {
            return res.status(400).json({ msg: 'E-book is already issued to another user' });
        }

        ebook.issuedTo = user._id;
        ebook.dateIssued = new Date();
        ebook.returnDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

        user.issuedBooks.push(ebook._id);

        await ebook.save();
        await user.save();

        res.json({ msg: 'E-book requested successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/ebooks/:id/return', auth, async (req, res) => {
    const userId = req.user.id;
    try {
        let ebook = await Ebook.findById(req.params.id);
        if (!ebook) {
            return res.status(404).json({ msg: 'E-book not found' });
        }

        if (ebook.issuedTo.toString() !== userId) {
            return res.status(400).json({ msg: 'You do not have this e-book issued' });
        }

        ebook.issuedTo = null;
        ebook.dateIssued = null;
        ebook.returnDate = null;

        let user = await User.findById(userId);
        user.issuedBooks = user.issuedBooks.filter(
            bookId => bookId.toString() !== ebook._id.toString()
        );

        await ebook.save();
        await user.save();

        res.json({ msg: 'E-book returned successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Feedback for E-book
router.post('/ebooks/:id/feedback', auth, async (req, res) => {
    const userId = req.user.id;
    const { rating, comment } = req.body;
    try {
        let ebook = await Ebook.findById(req.params.id);
        if (!ebook) {
            return res.status(404).json({ msg: 'E-book not found' });
        }

        let user = await User.findById(userId);

        user.feedback.push({ ebook: ebook._id, rating, comment });
        await user.save();

        res.json({ msg: 'Feedback submitted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
