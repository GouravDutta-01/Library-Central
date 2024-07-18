import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { toast } from 'react-toastify';

const RequestManagement = () => {
    const { token } = useContext(AppContext);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/librarian/requests', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRequests(res.data);
            } catch (err) {
                console.error(err);
                toast.error('Failed to fetch requests');
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, [token]);

    const handleRequest = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/librarian/requests/${id}`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update the status of the request in the state
            setRequests(prevRequests => 
                prevRequests.map(request => 
                    request._id === id ? { ...request, status } : request
                )
            );
            toast.success(`Request ${status} successfully`);
        } catch (err) {
            console.error(err);
            toast.error('Failed to update request');
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container sx={{ paddingTop: 5 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Manage Requests
            </Typography>
            <List>
                {requests.map(request => (
                    <ListItem key={request._id}>
                        <ListItemText
                            primary={`${request.ebook?.name || 'Unknown E-book'} - ${request.username}`}
                            secondary={`Status: ${request.status}`}
                        />
                        {request.status === 'pending' && (
                            <>
                                <Button onClick={() => handleRequest(request._id, 'granted')} sx={{marginRight: 2}} variant="contained" color="primary">
                                    Grant
                                </Button>
                                <Button onClick={() => handleRequest(request._id, 'rejected')} variant="contained" color="secondary">
                                    Reject
                                </Button>
                            </>
                        )}
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default RequestManagement;
