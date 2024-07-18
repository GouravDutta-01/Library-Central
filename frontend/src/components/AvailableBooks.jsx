import React, { useEffect, useState, useContext } from 'react';
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
  Button
} from '@mui/material';
import { toast } from 'react-toastify';

const AvailableBooks = () => {
  const { token } = useContext(AppContext);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/user/ebooks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBooks(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBooks();
  }, [token]);

  const requestBook = async (bookId) => {
    try {
      await axios.post(`http://localhost:5000/api/user/ebooks/${bookId}/request`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Book requested successfully');
    } catch (err) {
      console.error(err);
      toast.error('Error requesting book');
    }
  };

  return (
    <Container sx={{ paddingTop: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Available Books
      </Typography>
      <TableContainer component={Paper} sx={{ border: '1px solid #ccc', marginTop: 2, marginBottom: 5 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Book Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Section Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book._id}>
                <TableCell>{book.name}</TableCell>
                <TableCell>{book.section?.name}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => requestBook(book._id)}
                  >
                    Request
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AvailableBooks;
