import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

const FeedbackManagement = () => {
  const { token } = useContext(AppContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/librarian/feedbacks",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFeedbacks(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFeedbacks();
  }, [token]);

  const handleDeleteClick = (feedback) => {
    setSelectedFeedback(feedback);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFeedback(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/librarian/feedbacks/${selectedFeedback._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFeedbacks(feedbacks.filter((feedback) => feedback._id !== selectedFeedback._id));
      toast.success("Feedback deleted successfully");
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting feedback");
    }
  };

  return (
    <Container sx={{ paddingTop: 5 }}>
      {feedbacks.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{ border: "1px solid #ccc", marginTop: 2, marginBottom: 5 }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>E-book Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Username</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Comment</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Rating</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
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
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(feedback)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography
          color="textSecondary"
          variant="h6"
          component="p"
          gutterBottom
        >
          No feedback available.
        </Typography>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Feedback"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this feedback?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FeedbackManagement;
