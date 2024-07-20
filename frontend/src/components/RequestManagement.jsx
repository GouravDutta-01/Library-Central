import React, { useState, useEffect, useContext } from "react";
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
  Button,
} from "@mui/material";
import { toast } from "react-toastify";

const RequestManagement = () => {
  const { token } = useContext(AppContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/librarian/requests",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRequests(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [token]);

  const handleRequest = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/librarian/requests/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === id
            ? {
                ...request,
                status,
                dateIssued:
                  status === "granted" ? new Date() : request.dateIssued,
                returnDate:
                  status === "granted"
                    ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    : request.returnDate,
              }
            : request
        )
      );

      toast.success(`Request ${status} successfully`);
    } catch (err) {
      const errorMessage =
        err.response?.data?.msg || "Failed to update request";
      console.error(err);
      toast.error(errorMessage);
    }
  };

  const handleRevoke = async (id) => {
    try {
      await axios.post(
        `http://localhost:5000/api/librarian/ebooks/${id}/revoke`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.ebook._id === id ? { ...request, status: "revoked" } : request
        )
      );
      toast.success("E-book revoked successfully");
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Failed to revoke E-book";
      console.error(err);
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  const pendingRequests = requests.filter(
    (request) => request.status === "pending"
  );
  const grantedBooks = requests.filter(
    (request) => request.status === "granted"
  );

  return (
    <Container sx={{ paddingTop: 5 }}>
      {pendingRequests.length > 0 ? (
        <>
          <Typography variant="h6" component="h2" gutterBottom sx={{ fontFamily: "Montserrat", color: "#d6d925", fontWeight: "bold" }}>
            Pending Requests
          </Typography>
          <TableContainer
            component={Paper}
            sx={{ border: "1px solid #ccc", marginTop: 2, marginBottom: 10 }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Book Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>User Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingRequests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell>
                      {request.ebook?.name || "Unknown E-book"}
                    </TableCell>
                    <TableCell>{request.username}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleRequest(request._id, "granted")}
                        sx={{ marginRight: 2 }}
                        variant="contained"
                        color="primary"
                      >
                        Grant
                      </Button>
                      <Button
                        onClick={() => handleRequest(request._id, "rejected")}
                        variant="contained"
                        color="secondary"
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <Typography
          color="textSecondary"
          variant="h6"
          component="p"
          gutterBottom
        >
          No pending requests.
        </Typography>
      )}
      {grantedBooks.length > 0 ? (
        <>
          <Typography variant="h6" component="h2" gutterBottom sx={{ fontFamily: "Montserrat", color: "#06781f", fontWeight: "bold" }}>
            Granted Books
          </Typography>
          <TableContainer
            component={Paper}
            sx={{ border: "1px solid #ccc", marginTop: 2, marginBottom: 10 }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Book Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>User Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Date Issued</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Return Date</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {grantedBooks.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell>{request.ebook.name}</TableCell>
                    <TableCell>{request.username}</TableCell>
                    <TableCell>
                      {new Date(request.dateIssued).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(request.returnDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleRevoke(request.ebook._id)}
                        variant="contained"
                        color="secondary"
                      >
                        Revoke
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <Typography
          color="textSecondary"
          variant="h6"
          component="p"
          gutterBottom
        >
          No active granted requests.
        </Typography>
      )}
    </Container>
  );
};

export default RequestManagement;
