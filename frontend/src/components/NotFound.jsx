import React from 'react';
import { Box, Typography } from '@mui/material';

const NotFound = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="80vh"
        >
            <Typography variant="h1" component="h1" gutterBottom>
                404
            </Typography>
            <Typography variant="h4" component="h2" gutterBottom>
                Page Not Found
            </Typography>
            <Typography variant="body1">
                Sorry, the page you are looking for does not exist or you do not have access to it.
            </Typography>
        </Box>
    );
};

export default NotFound;
