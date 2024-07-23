import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Box, Button, TextField, Typography } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { toast } from "react-toastify";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { role, dispatch } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (role) {
      navigate(`/${role}`);
    }
  }, [role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { token: res.data.token, role: res.data.user.role },
      });
      navigate(`/${res.data.user.role}`);
      toast.success("Login successful!");
    } catch (err) {
      const errorMessage =
        err.response?.data?.msg || "Error during login";
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
          padding={3}
          borderRadius={5}
          boxShadow={"5px 5px 10px #ccc"}
        >
          <Typography variant="h2" padding={5} fontWeight="500">
            Login
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
            type={"password"}
            variant="outlined"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          <Button
            startIcon={<LoginIcon />}
            sx={{ marginTop: 3, borderRadius: 3 }}
            variant="contained"
            color="primary"
            type="submit"
          >
            Login
          </Button>
          <Link to="/register">
            <Button
              endIcon={<PersonAddIcon />}
              sx={{ marginTop: 6, borderRadius: 3 }}
              color="secondary"
            >
              Change to Register
            </Button>
          </Link>
        </Box>
      </form>
    </div>
  );
};

export default Login;
