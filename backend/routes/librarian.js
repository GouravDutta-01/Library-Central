const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Section = require('../models/Section');
const Ebook = require('../models/Ebook');

// Ensure the user is a librarian
const librarianAuth = (req, res, next) => {
    if (req.user.role !== 'librarian') {
        return res.status(403).json({ msg: 'Access denied' });
    }
    next();
};

// Librarian Dashboard
router.get('/dashboard', auth, librarianAuth, async (req, res) => {
    try {
        const users = await User.countDocuments({ role: 'user' });
        const sections = await Section.countDocuments();
        const ebooks = await Ebook.countDocuments();
        const stats = {
            users,
            sections,
            ebooks
        };
        res.json(stats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Section Management
router.post('/sections', auth, librarianAuth, async (req, res) => {
    const { name, description } = req.body;
    try {
        let section = new Section({
            name,
            description
        });

        await section.save();
        res.json(section);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.put('/sections/:id', auth, librarianAuth, async (req, res) => {
    const { name, description } = req.body;
    try {
        let section = await Section.findById(req.params.id);
        if (!section) {
            return res.status(404).json({ msg: 'Section not found' });
        }
        section.name = name || section.name;
        section.description = description || section.description;
        await section.save();
        res.json(section);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.delete('/sections/:id', auth, librarianAuth, async (req, res) => {
    try {
        await Section.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Section removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// E-book Management
router.post('/ebooks', auth, librarianAuth, async (req, res) => {
    const { name, content, authors, section } = req.body;
    try {
        let ebook = new Ebook({
            name,
            content,
            authors,
            section
        });

        await ebook.save();
        res.json(ebook);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.put('/ebooks/:id', auth, librarianAuth, async (req, res) => {
    const { name, content, authors, section } = req.body;
    try {
        let ebook = await Ebook.findById(req.params.id);
        if (!ebook) {
            return res.status(404).json({ msg: 'E-book not found' });
        }
        ebook.name = name || ebook.name;
        ebook.content = content || ebook.content;
        ebook.authors = authors || ebook.authors;
        ebook.section = section || ebook.section;
        await ebook.save();
        res.json(ebook);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.delete('/ebooks/:id', auth, librarianAuth, async (req, res) => {
    try {
        await Ebook.findByIdAndRemove(req.params.id);
        res.json({ msg: 'E-book removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Grant/Revoke E-book
router.post('/ebooks/:id/grant', auth, librarianAuth, async (req, res) => {
    const { userId } = req.body;
    try {
        let ebook = await Ebook.findById(req.params.id);
        if (!ebook) {
            return res.status(404).json({ msg: 'E-book not found' });
        }
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (user.issuedBooks.length >= 5) {
            return res.status(400).json({ msg: 'User has already requested 5 e-books' });
        }

        ebook.issuedTo = user._id;
        ebook.dateIssued = new Date();
        ebook.returnDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

        user.issuedBooks.push(ebook._id);

        await ebook.save();
        await user.save();

        res.json({ msg: 'E-book access granted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/ebooks/:id/revoke', auth, librarianAuth, async (req, res) => {
    const { userId } = req.body;
    try {
        let ebook = await Ebook.findById(req.params.id);
        if (!ebook) {
            return res.status(404).json({ msg: 'E-book not found' });
        }
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        ebook.issuedTo = null;
        ebook.dateIssued = null;
        ebook.returnDate = null;

        user.issuedBooks = user.issuedBooks.filter(
            bookId => bookId.toString() !== ebook._id.toString()
        );

        await ebook.save();
        await user.save();

        res.json({ msg: 'E-book access revoked' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
