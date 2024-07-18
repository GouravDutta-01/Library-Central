import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { Container, Typography, Button, Modal, Box, TextField, Rating, Card, CardContent, CardActions, Grid, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const UserDashboard = () => {
    const { token } = useContext(AppContext);
    const [issuedBooks, setIssuedBooks] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentEbook, setCurrentEbook] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        const fetchIssuedBooks = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/user/issued-books', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIssuedBooks(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        
        fetchIssuedBooks();
    }, [token]);

    const handleFeedbackOpen = (ebook) => {
        setCurrentEbook(ebook);
        setOpen(true);
    };

    const handleFeedbackClose = () => {
        setOpen(false);
        setRating(0);
        setComment('');
    };

    const handleSubmitFeedback = async () => {
        try {
            await axios.post(
                `http://localhost:5000/api/user/ebooks/${currentEbook._id}/feedback`,
                { rating, comment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOpen(false);
            setRating(0);
            setComment('');
        } catch (err) {
            console.error(err);
        }
    };

    const handleReturnEbook = async (ebookId) => {
        try {
            await axios.post(
                `http://localhost:5000/api/user/ebooks/${ebookId}/return`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Assuming issuedBooks is an array of objects with _id field
            setIssuedBooks(prevIssuedBooks => prevIssuedBooks.filter(book => book._id !== ebookId));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Container sx={{ paddingTop: 5 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                User Dashboard
            </Typography>
            <Typography variant="h6">Issued Books</Typography>
            <Grid container spacing={2}>
                {issuedBooks.map((book, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    {book.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {book.content}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Authors: {book.authors.join(', ')}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Section: {book.section}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Issued Date: {new Date(book.dateIssued).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Return Date: {new Date(book.returnDate).toLocaleDateString()}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button onClick={() => handleFeedbackOpen(book)} variant="contained" sx={{ mr: 1 }}>
                                    Give Feedback
                                </Button>
                                <Button onClick={() => handleReturnEbook(book._id)} variant="contained" color="secondary">
                                    Return Book
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Modal
                open={open}
                onClose={handleFeedbackClose}
                aria-labelledby="feedback-modal-title"
                aria-describedby="feedback-modal-description"
            >
                <Box sx={{ ...style, width: 400 }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleFeedbackClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography id="feedback-modal-title" variant="h6" component="h2">
                        Add Feedback
                    </Typography>
                    <Rating
                        name="rating"
                        value={rating}
                        onChange={(event, newValue) => setRating(newValue)}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        label="Comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                        sx={{ mt: 2 }}
                    />
                    <Button onClick={handleSubmitFeedback} variant="contained" sx={{ mt: 2 }}>
                        Submit
                    </Button>
                </Box>
            </Modal>
        </Container>
    );
};

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default UserDashboard;
