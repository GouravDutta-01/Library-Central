import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  const { role, logout } = useContext(AppContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            whiteSpace: "nowrap",
          }}
        >
          Library Management System
        </Typography>
        {isMatch ? (
          <MobileMenu handleLogout={handleLogout} />
        ) : (
          <Grid container spacing={2} justifyContent="flex-end">
            <Grid item>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
            </Grid>
            {role && (
              <Grid item>
                <Button
                  color="inherit"
                  component={Link}
                  to={role === "librarian" ? "/librarian" : "/user"}
                >
                  Dashboard
                </Button>
              </Grid>
            )}
            {role === "librarian" && (
              <>
                <Grid item>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/manage-sections"
                  >
                    Manage Sections
                  </Button>
                </Grid>
                <Grid item>
                  <Button color="inherit" component={Link} to="/manage-ebooks">
                    Manage E-books
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/manage-requests"
                  >
                    Manage Requests
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/manage-feedbacks"
                  >
                    Manage Feedbacks
                  </Button>
                </Grid>
              </>
            )}
            {role === "user" && (
              <>
                <Grid item>
                  <Button color="inherit" component={Link} to="/search">
                    Search
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/available-books"
                  >
                    Available Books
                  </Button>
                </Grid>
              </>
            )}
            {role ? (
              <Grid item>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </Grid>
            ) : (
              <>
                <Grid item>
                  <Button color="inherit" component={Link} to="/register">
                    Register
                  </Button>
                </Grid>
                <Grid item>
                  <Button color="inherit" component={Link} to="/login">
                    Login
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
