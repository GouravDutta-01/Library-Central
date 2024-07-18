import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { Container, TextField, Button, Typography, List, ListItem, ListItemText } from '@mui/material';

const Search = () => {
    const { token } = useContext(AppContext);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/search?q=${query}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResults(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Container sx={{paddingTop : 5}}>
            <Typography variant="h4" component="h1" gutterBottom>
                Search
            </Typography>
            <TextField
                label="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{paddingBottom : 2}}
                fullWidth
                required
            />
            <Button onClick={handleSearch} variant="contained" color="primary">
                Search
            </Button>
            <List>
                {results.map(result => (
                    <ListItem key={result._id}>
                        <ListItemText primary={result.name} />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default Search;
