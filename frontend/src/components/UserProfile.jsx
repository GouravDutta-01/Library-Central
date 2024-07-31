import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import {
  Button,
  TextField,
  Container,
  Paper,
  Grid,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserProfile = () => {
  const { token, logout } = useContext(AppContext);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData({ ...response.data, password: "" });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put("http://localhost:5000/api/user/me", userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditMode(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Error updating profile";
      console.error(error);
      toast.error(errorMessage);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:5000/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      logout();
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Error deleting account";
      console.error(error);
      toast.error(errorMessage);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDeleteConfirm = () => {
    handleDelete();
    handleCloseDialog();
  };

  return (
    <Container
      component={Paper}
      style={{ padding: "20px", marginTop: "40px", boxShadow: "none" }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Username"
            name="username"
            value={userData.username}
            onChange={handleInputChange}
            fullWidth
            disabled={!editMode}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            fullWidth
            disabled={!editMode}
          />
        </Grid>
        {editMode && (
          <Grid item xs={12}>
            <TextField
              label="Password"
              name="password"
              type="password"
              value={userData.password}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
        )}
      </Grid>
      <Box display="flex" justifyContent="flex-end" mt={2}>
        {editMode ? (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdate}
              style={{ marginRight: "10px" }}
            >
              Update
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setEditMode(true)}
              style={{ marginRight: "10px" }}
            >
              Edit
            </Button>
            <Button variant="outlined" color="error" onClick={handleOpenDialog}>
              Delete Account
            </Button>
          </>
        )}
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete your account? 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserProfile;
