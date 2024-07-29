import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Box, Button, TextField, Typography } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LoginIcon from "@mui/icons-material/Login";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { dispatch } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        username,
        password,
        email,
      });
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { token: res.data.token, role: "user" },
      });
      navigate("/user");
      toast.success("Registration successful!");
    } catch (err) {
      const errorMessage =
        err.response?.data?.errors?.[0]?.msg || "Error during register";
      console.error(err);
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{ ":hover": { boxShadow: "10px 10px 20px #ccc" } }}
          display="flex"
          flexDirection={"column"}
          maxWidth={400}
          alignItems={"center"}
          justifyContent={"center"}
          margin={"auto"}
          marginTop={5}
          marginBottom={5}
          padding={3}
          borderRadius={5}
          boxShadow={"5px 5px 10px #ccc"}
        >
          <Typography variant="h2" padding={5} fontWeight="500">
            Register
          </Typography>
          <TextField
            margin="normal"
            type={"text"}
            variant="outlined"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            required
          />
          <TextField
            margin="normal"
            type={"email"}
            variant="outlined"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          <TextField
            margin="normal"
            type={"password"}
            variant="outlined"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          <Button
            startIcon={<PersonAddIcon />}
            sx={{ marginTop: 3, borderRadius: 3 }}
            variant="contained"
            color="primary"
            type="submit"
          >
            Register
          </Button>
          <Link to="/login">
            <Button
              endIcon={<LoginIcon />}
              sx={{ marginTop: 6, borderRadius: 3 }}
              color="secondary"
            >
              Change to Login
            </Button>
          </Link>
        </Box>
      </form>
    </div>
  );
};

export default Register;
