import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Button,
  Modal,
  TextField,
  Rating,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import NotFound from "./NotFound";

const EbookDetail = () => {
  const { id } = useParams();
  const { token } = useContext(AppContext);
  const [ebook, setEbook] = useState(null);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchEbook = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/user/ebooks/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEbook(res.data);
      } catch (err) {
        setError(err.response?.status === 403 ? "Access denied" : "Not Found");
      }
    };

    fetchEbook();
  }, [id, token]);

  const handleFeedbackOpen = () => {
    setOpen(true);
  };

  const handleFeedbackClose = () => {
    setOpen(false);
    setRating(0);
    setComment("");
  };

  const handleSubmitFeedback = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/user/ebooks/${id}/feedback`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Feedback sent successfully");
      setOpen(false);
      setRating(0);
      setComment("");
    } catch (err) {
      console.error(err);
      toast.error("Error sending Feedback");
    }
  };

  if (error) {
    return <NotFound />;
  }

  if (!ebook) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container sx={{ paddingTop: 5, paddingBottom: 5 }}>
      <Box
        sx={{
          padding: 4,
          border: "1px solid #ccc",
          borderRadius: "8px",
          textAlign: "center",
          marginTop: "16px",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            textDecoration: "underline",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          {ebook.name}
        </Typography>
        <Typography
          variant="subtitle1"
          component="h2"
          gutterBottom
          sx={{ textAlign: "left", color: "text.secondary", marginBottom: 3 }}
        >
          Author: {ebook.authors.join(", ")}
        </Typography>
        <Typography
          variant="body1"
          component="p"
          sx={{ whiteSpace: "pre-wrap", textAlign: "left", marginTop: 4 }}
        >
          {ebook.content}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 4, marginRight: 2 }}
          component={Link}
          to="/user"
        >
          Back to Dashboard
        </Button>
        <Button
          variant="contained"
          color="secondary"
          sx={{ marginTop: 4 }}
          onClick={handleFeedbackOpen}
        >
          Give Feedback
        </Button>
      </Box>
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
              position: "absolute",
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
            sx={{ mt: 2, mb: 2 }}
          />
          <Button
            onClick={handleSubmitFeedback}
            variant="contained"
            sx={{ mr: 1 }}
          >
            Submit
          </Button>
          <Button
              onClick={handleFeedbackClose}
              variant="contained"
              color="secondary"
            >
              Close
            </Button>
        </Box>
      </Modal>
    </Container>
  );
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default EbookDetail;
