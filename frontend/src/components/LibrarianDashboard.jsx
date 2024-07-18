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
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const LibrarianDashboard = () => {
  const { token } = useContext(AppContext);
  const [data, setData] = useState({
    usersCount: 0,
    sections: 0,
    ebooks: 0,
    users: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/librarian/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      }
    };

    fetchData();
  }, [token]);

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/librarian/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData((prevState) => ({
        ...prevState,
        users: prevState.users.filter((user) => user._id !== id),
      }));
    } catch (err) {
      console.error('Error deleting user', err);
    }
  };

  return (
    <Container sx={{ paddingTop: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Librarian Dashboard
      </Typography>
      <Typography variant="h6">Active Users: {data.usersCount}</Typography>
      <Typography variant="h6">Sections: {data.sections}</Typography>
      <Typography variant="h6">E-books: {data.ebooks}</Typography>
      <div>
        <Typography variant="h6" gutterBottom sx={{paddingTop: 5}}>
          All Users
        </Typography>
        <TableContainer component={Paper} sx={{ border: '1px solid #ccc' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => deleteUser(user._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Container>
  );
};

export default LibrarianDashboard;
