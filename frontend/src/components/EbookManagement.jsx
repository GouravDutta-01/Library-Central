import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
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
  MenuItem,
  Grid,
  InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { toast } from "react-toastify";

const EbookManagement = () => {
  const { token } = useContext(AppContext);
  const [ebooks, setEbooks] = useState([]);
  const [sections, setSections] = useState([]);
  const [newEbook, setNewEbook] = useState({
    name: "",
    content: "",
    authors: "",
    section: "",
  });
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    bookName: "",
    authorName: "",
    sectionName: "",
  });

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/ebooks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEbooks(res.data);
        setFilteredBooks(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchSections = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/sections", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSections(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEbooks();
    fetchSections();
  }, [token]);

  useEffect(() => {
    const { bookName, authorName, sectionName } = searchCriteria;
    const filtered = ebooks.filter(
      (book) =>
        (bookName === "" ||
          book.name.toLowerCase().includes(bookName.toLowerCase())) &&
        (authorName === "" ||
          book.authors.some((author) =>
            author.toLowerCase().includes(authorName.toLowerCase())
          )) &&
        (sectionName === "" ||
          book.section?.name.toLowerCase().includes(sectionName.toLowerCase()))
    );
    setFilteredBooks(filtered);
  }, [searchCriteria, ebooks]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleClearSearch = (field) => {
    setSearchCriteria((prevState) => ({ ...prevState, [field]: "" }));
  };

  const addEbook = async () => {
    try {
      await axios.post("http://localhost:5000/api/librarian/ebooks", newEbook, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("E-book added successfully");
      const res = await axios.get("http://localhost:5000/api/user/ebooks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEbooks(res.data);
      setFilteredBooks(res.data);
      setNewEbook({
        name: "",
        content: "",
        authors: "",
        section: "",
      });
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Error adding E-book";
      console.error(err);
      toast.error(errorMessage);
    }
  };

  const deleteEbook = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/librarian/ebooks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEbooks(ebooks.filter((ebook) => ebook._id !== id));
      setFilteredBooks(filteredBooks.filter((ebook) => ebook._id !== id));
      toast.success("E-book deleted successfully");
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Error deleting E-book";
      console.error(err);
      toast.error(errorMessage);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEbook({ ...newEbook, [name]: value });
  };

  return (
    <Container sx={{ paddingTop: 5 }}>
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
        {sections.map((section) => (
          <MenuItem key={section._id} value={section._id}>
            {section.name}
          </MenuItem>
        ))}
      </TextField>
      <Button
        onClick={addEbook}
        variant="contained"
        color="primary"
        sx={{ marginBottom: 5 }}
      >
        Add E-book
      </Button>
      <Grid container spacing={2} sx={{ marginBottom: 3 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search Book Name"
            name="bookName"
            value={searchCriteria.bookName}
            onChange={handleSearchChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchCriteria.bookName && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleClearSearch("bookName")}
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: "20px" },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search Author Name"
            name="authorName"
            value={searchCriteria.authorName}
            onChange={handleSearchChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchCriteria.authorName && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleClearSearch("authorName")}
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: "20px" },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search Section Name"
            name="sectionName"
            value={searchCriteria.sectionName}
            onChange={handleSearchChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchCriteria.sectionName && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleClearSearch("sectionName")}
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: "20px" },
            }}
          />
        </Grid>
      </Grid>
      {filteredBooks.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{ border: "1px solid #ccc", marginTop: 2, marginBottom: 10 }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>E-book Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Authors</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Section</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBooks.map((ebook) => (
                <TableRow key={ebook._id}>
                  <TableCell>{ebook.name}</TableCell>
                  <TableCell>{ebook.authors.join(", ")}</TableCell>
                  <TableCell>{ebook.section?.name}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => deleteEbook(ebook._id)}
                      color="error"
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
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          No E-books found.
        </Typography>
      )}
    </Container>
  );
};

export default EbookManagement;
