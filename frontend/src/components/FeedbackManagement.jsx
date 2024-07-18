import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';

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

  const deleteFeedback = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/librarian/feedbacks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeedbacks(feedbacks.filter(feedback => feedback._id !== id)); 
      toast.success('Feedback deleted successfully');
    } catch (err) {
      console.error(err);
      toast.error('Error deleting Feedback');
    }
  };

  return (
    <Container sx={{ paddingTop: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Manage Feedbacks
      </Typography>
      <TableContainer component={Paper} sx={{ border: '1px solid #ccc', marginTop: 2, marginBottom: 5 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>E-book Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Comment</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Rating</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feedbacks.map((feedback) => (
              <TableRow key={feedback._id}>
                <TableCell>{feedback.ebook}</TableCell>
                <TableCell>{feedback.username}</TableCell>
                <TableCell>{feedback.comment}</TableCell>
                <TableCell>{feedback.rating}</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => deleteFeedback(feedback._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default FeedbackManagement;
