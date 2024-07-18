import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';

const EbookManagement = () => {
  const { token } = useContext(AppContext);
  const [ebooks, setEbooks] = useState([]);
  const [sections, setSections] = useState([]);
  const [newEbook, setNewEbook] = useState({
    name: '',
    content: '',
    authors: '',
    section: ''
  });

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/user/ebooks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEbooks(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchSections = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/user/sections', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSections(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEbooks();
    fetchSections();
  }, [token]);

  const addEbook = async () => {
    try {
      await axios.post('http://localhost:5000/api/librarian/ebooks', newEbook, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('E-book added successfully');
      const res = await axios.get('http://localhost:5000/api/user/ebooks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEbooks(res.data);
      setNewEbook({
        name: '',
        content: '',
        authors: '',
        section: ''
      });
    } catch (err) {
      console.error(err);
      toast.error('Error adding e-book');
    }
  };

  const deleteEbook = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/librarian/ebooks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEbooks(ebooks.filter(ebook => ebook._id !== id));
      toast.success('E-book deleted successfully');
    } catch (err) {
      console.error(err);
      toast.error('Error deleting e-book');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEbook({ ...newEbook, [name]: value });
  };

  return (
    <Container sx={{ paddingTop: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Manage E-books
      </Typography>
      <TextField
        label="E-book Name"
        name="name"
        value={newEbook.name}
        onChange={handleChange}
        sx={{ marginBottom: 2 }}
        fullWidth
        required
      />
      <TextField
        label="Content"
        name="content"
        value={newEbook.content}
        onChange={handleChange}
        sx={{ marginBottom: 2 }}
        fullWidth
        required
      />
      <TextField
        label="Authors (comma separated)"
        name="authors"
        value={newEbook.authors}
        onChange={handleChange}
        sx={{ marginBottom: 2 }}
        fullWidth
        required
      />
      <TextField
        select
        label="Section"
        name="section"
        value={newEbook.section}
        onChange={handleChange}
        sx={{ marginBottom: 2 }}
        fullWidth
        required
      >
        {sections.map(section => (
          <MenuItem key={section._id} value={section._id}>
            {section.name}
          </MenuItem>
        ))}
      </TextField>
      <Button onClick={addEbook} variant="contained" color="primary" sx={{ marginBottom: 2 }}>
        Add E-book
      </Button>
      <TableContainer component={Paper} sx={{ border: '1px solid #ccc', marginTop: 2, marginBottom: 5 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>E-book Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Authors</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Section</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ebooks.map((ebook) => (
              <TableRow key={ebook._id}>
                <TableCell>{ebook.name}</TableCell>
                <TableCell>{ebook.authors.join(', ')}</TableCell>
                <TableCell>{ebook.section.name}</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => deleteEbook(ebook._id)}>
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

export default EbookManagement;
