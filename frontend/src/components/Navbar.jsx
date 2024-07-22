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
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import MobileMenu from "./MobileMenu";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const Navbar = () => {
  const { role, logout } = useContext(AppContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getButtonStyle = (path) => {
    return currentPath === path
      ? {
          background: "linear-gradient(to right, #567ff5, #020a21)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: "bold",
          transform: "scale(1.2)",
          transition: "transform 0.2s",
        }
      : {
          color: "#2e4a6b",
        };
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#a6dcef" }}>
      <Toolbar>
        <MenuBookIcon sx={{ marginRight: 1, color: "#171b45" }} />
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              whiteSpace: "nowrap",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 800,
              background: "linear-gradient(to right, #567ff5, #020a21)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Library Central
          </Typography>
        </Link>
        {isMatch ? (
          <MobileMenu handleLogout={handleLogout} />
        ) : (
          <Grid container spacing={2} justifyContent="flex-end">
            <Grid item>
              <Button
                color="inherit"
                component={Link}
                to="/"
                sx={getButtonStyle("/")}
              >
                Home
              </Button>
            </Grid>
            {role && (
              <Grid item>
                <Button
                  color="inherit"
                  component={Link}
                  to={role === "librarian" ? "/librarian" : "/user"}
                  sx={getButtonStyle(
                    role === "librarian" ? "/librarian" : "/user"
                  )}
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
                    sx={getButtonStyle("/manage-sections")}
                  >
                    Manage Sections
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/manage-ebooks"
                    sx={getButtonStyle("/manage-ebooks")}
                  >
                    Manage E-books
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/manage-requests"
                    sx={getButtonStyle("/manage-requests")}
                  >
                    Manage Requests
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/manage-feedbacks"
                    sx={getButtonStyle("/manage-feedbacks")}
                  >
                    Manage Feedbacks
                  </Button>
                </Grid>
              </>
            )}
            {role === "user" && (
              <>
                <Grid item>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/available-books"
                    sx={getButtonStyle("/available-books")}
                  >
                    Available Books
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/profile"
                    sx={getButtonStyle("/profile")}
                  >
                    My Profile
                  </Button>
                </Grid>
              </>
            )}
            {role ? (
              <Grid item>
                <Button
                  color="inherit"
                  onClick={handleLogout}
                  sx={getButtonStyle("/logout")}
                >
                  Logout
                </Button>
              </Grid>
            ) : (
              <>
                <Grid item>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/register"
                    sx={getButtonStyle("/register")}
                  >
                    Register
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/login"
                    sx={getButtonStyle("/login")}
                  >
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
