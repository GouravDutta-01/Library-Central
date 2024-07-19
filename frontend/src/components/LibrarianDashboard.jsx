import React, { useEffect, useState, useContext } from "react";
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
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import BookIcon from "@mui/icons-material/Book";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import { toast } from 'react-toastify';

const LibrarianDashboard = () => {
  const { token } = useContext(AppContext);
  const [data, setData] = useState({
    usersCount: 0,
    sections: 0,
    ebooks: 0,
    totalBooksIssued: 0,
    users: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/librarian/dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(res.data);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
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
      toast.success('User deleted successfully');
    } catch (err) {
      console.error("Error deleting user", err);
      toast.error('Error deleting User');
    }
  };

  return (
    <Container sx={{ paddingTop: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Librarian Dashboard
      </Typography>
      <Grid container spacing={3} sx={{ marginBottom: 5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#eb348f",
              color: "#fff",
              height: 150,
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <CardMedia>
              <PeopleIcon sx={{ fontSize: 50, margin: 2 }} />
            </CardMedia>
            <CardContent>
              <Typography variant="h6">Active Users</Typography>
              <Typography variant="h4">{data.usersCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#51a9ed",
              color: "#fff",
              height: 150,
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <CardMedia>
              <LibraryBooksIcon sx={{ fontSize: 50, margin: 2 }} />
            </CardMedia>
            <CardContent>
              <Typography variant="h6">Total Sections</Typography>
              <Typography variant="h4">{data.sections}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#75e354",
              color: "#fff",
              height: 150,
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <CardMedia>
              <BookIcon sx={{ fontSize: 50, margin: 2 }} />
            </CardMedia>
            <CardContent>
              <Typography variant="h6">Total E-books</Typography>
              <Typography variant="h4">{data.ebooks}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#FF9800",
              color: "#fff",
              height: 150,
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <CardMedia>
              <ImportContactsIcon sx={{ fontSize: 50, margin: 2 }} />
            </CardMedia>
            <CardContent>
              <Typography variant="h6">Total Books Issued</Typography>
              <Typography variant="h4">{data.totalBooksIssued}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Typography variant="h6" gutterBottom sx={{ paddingTop: 5 }}>
        All Users
      </Typography>
      <TableContainer component={Paper} sx={{ border: "1px solid #ccc", marginTop: 2, marginBottom: 10 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Username</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
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
    </Container>
  );
};

export default LibrarianDashboard;
