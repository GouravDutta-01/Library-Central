import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
} from "@mui/material";
import { toast } from "react-toastify";

const UserDashboard = () => {
  const { token } = useContext(AppContext);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIssuedBooks = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/user/issued-books",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIssuedBooks(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchIssuedBooks();
  }, [token]);

  const handleReturnEbook = async (ebookId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/user/ebooks/${ebookId}/return`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIssuedBooks((prevIssuedBooks) =>
        prevIssuedBooks.filter((book) => book._id !== ebookId)
      );
      toast.success("Ebook returned successfully");
    } catch (err) {
      console.error(err);
      toast.success("Error returning Ebook");
    }
  };

  const handleViewEbook = (ebookId) => {
    navigate(`/ebook/${ebookId}`);
  };

  return (
    <Container sx={{ padding: 5 }}>
      <Grid container spacing={2}>
        {issuedBooks.map((book, index) => (
          <Grid item xs={12} sm={6} md={6} key={index}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 3,
                padding: 1.5,
              }}
            >
              <CardContent>
                <Typography variant="h6" component="div" sx={{ marginBottom: 1 }}>
                  {book.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                  Author: {book.authors.join(", ")}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                  Section: {book.section}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                  Issued Date: {new Date(book.dateIssued).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                  Return Date: {new Date(book.returnDate).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  onClick={() => handleViewEbook(book._id)}
                  variant="contained"
                  color="primary"
                >
                  Open Ebook
                </Button>
                <Button
                  onClick={() => handleReturnEbook(book._id)}
                  variant="contained"
                  color="secondary"
                  sx={{ mr: 1 }}
                >
                  Return Book
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default UserDashboard;
