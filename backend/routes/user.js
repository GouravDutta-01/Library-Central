const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Ebook = require('../models/Ebook');
const Section = require('../models/Section');
const User = require('../models/User');

// User Dashboard
router.get('/dashboard', auth, async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId)
            .populate('issuedBooks')
            .populate('feedback.ebook');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const dashboardData = {
            requestedBooks: user.requestedBooks,
            issuedBooks: user.issuedBooks,
            feedback: user.feedback
        };

        res.json(dashboardData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// View issued e-books for a user
router.get('/issued-books', auth, async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId).populate({
            path: 'issuedBooks',
            populate: {
                path: 'section',
                select: 'name'
            }
        });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const issuedBooks = user.issuedBooks.map(book => ({
            name: book.name,
            content: book.content,
            authors: book.authors,
            section: book.section ? book.section.name : 'N/A',
            dateIssued: book.dateIssued,
            returnDate: book.returnDate,
            issuedTo: book.issuedTo
        }));

        res.json(issuedBooks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

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

// Request E-book
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

        const existingRequest = user.requestedBooks.find(
            request => request.ebook.toString() === ebook._id.toString()
        );

        if (existingRequest) {
            return res.status(400).json({ msg: 'You have already requested this e-book' });
        }

        user.requestedBooks.push({ ebook: ebook._id, status: 'pending' });

        await user.save();

        res.json({ msg: 'E-book requested successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// View Request Status
router.get('/ebooks/request-status', auth, async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId).populate('requestedBooks.ebook');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const requests = user.requestedBooks.map(request => ({
            ebook: request.ebook.name,
            status: request.status
        }));

        res.json(requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Return E-book
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
