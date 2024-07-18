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
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';

const SectionManagement = () => {
  const { token } = useContext(AppContext);
  const [sections, setSections] = useState([]);
  const [newSection, setNewSection] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
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

    fetchSections();
  }, [token]);

  const addSection = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/librarian/sections', newSection, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSections([...sections, res.data]);
      setNewSection({ name: '', description: '' });
      toast.success('Section added successfully');
    } catch (err) {
      console.error(err);
      toast.error('Error adding Section');
    }
  };

  const deleteSection = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/librarian/sections/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSections(sections.filter(section => section._id !== id));
      toast.success('Section deleted successfully');
    } catch (err) {
      console.error(err);
      toast.error('Error deleting Section');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSection({ ...newSection, [name]: value });
  };

  return (
    <Container sx={{ marginTop: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Manage Sections
      </Typography>
      <TextField
        label="Section Name"
        name="name"
        value={newSection.name}
        onChange={handleChange}
        sx={{ marginBottom: 2 }}
        fullWidth
        required
      />
      <TextField
        label="Description"
        name="description"
        value={newSection.description}
        onChange={handleChange}
        sx={{ marginBottom: 2 }}
        fullWidth
      />
      <Button onClick={addSection} variant="contained" color="primary" sx={{ marginBottom: 2 }}>
        Add Section
      </Button>
      <TableContainer component={Paper} sx={{ border: '1px solid #ccc', marginTop: 2, marginBottom: 5 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Section Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date Created</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sections.map((section) => (
              <TableRow key={section._id}>
                <TableCell>{section.name}</TableCell>
                <TableCell>{section.description}</TableCell>
                <TableCell>{new Date(section.dateCreated).toLocaleString()}</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => deleteSection(section._id)}>
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

export default SectionManagement;
