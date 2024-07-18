import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';

const FeedbackManagement = () => {
    const { token } = useContext(AppContext);
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/librarian/feedbacks', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFeedbacks(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchFeedbacks();
    }, [token]);

    return (
        <Container sx={{paddingTop : 5}}>
            <Typography variant="h4" component="h1" gutterBottom>
                Manage Feedbacks
            </Typography>
            <List>
                {feedbacks.map(feedback => (
                    <ListItem key={feedback._id}>
                        <ListItemText primary={`${feedback.ebook.name}: ${feedback.comment}`} secondary={`Rating: ${feedback.rating}`} />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default FeedbackManagement;
