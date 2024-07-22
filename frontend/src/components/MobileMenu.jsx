import React, { useContext, useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import FeedbackIcon from "@mui/icons-material/Feedback";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const MobileMenu = ({ handleLogout }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const { role } = useContext(AppContext);

  const handleMenuClick = (route) => {
    setOpenMenu(false);
    navigate(route);
  };

  return (
    <>
      <Drawer
        anchor="right"
        PaperProps={{
          sx: {
            width: "93%",
            height: "auto",
            backgroundColor: "#e3f2fd",
            boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
            margin: "16px",
            borderRadius: "8px",
          },
        }}
        open={openMenu}
        onClose={() => setOpenMenu(false)}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 2,
          }}
        >
          <Typography variant="h6">Menu</Typography>
          <IconButton onClick={() => setOpenMenu(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          <ListItemButton onClick={() => handleMenuClick("/")}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText>Home</ListItemText>
          </ListItemButton>
          {role && (
            <ListItemButton
              onClick={() =>
                handleMenuClick(role === "librarian" ? "/librarian" : "/user")
              }
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText>Dashboard</ListItemText>
            </ListItemButton>
          )}
          {role === "librarian" && (
            <>
              <ListItemButton
                onClick={() => handleMenuClick("/manage-sections")}
              >
                <ListItemIcon>
                  <ManageAccountsIcon />
                </ListItemIcon>
                <ListItemText>Manage Sections</ListItemText>
              </ListItemButton>
              <ListItemButton onClick={() => handleMenuClick("/manage-ebooks")}>
                <ListItemIcon>
                  <LibraryBooksIcon />
                </ListItemIcon>
                <ListItemText>Manage E-books</ListItemText>
              </ListItemButton>
              <ListItemButton
                onClick={() => handleMenuClick("/manage-requests")}
              >
                <ListItemIcon>
                  <RequestPageIcon />
                </ListItemIcon>
                <ListItemText>Manage Requests</ListItemText>
              </ListItemButton>
              <ListItemButton
                onClick={() => handleMenuClick("/manage-feedbacks")}
              >
                <ListItemIcon>
                  <FeedbackIcon />
                </ListItemIcon>
                <ListItemText>Manage Feedbacks</ListItemText>
              </ListItemButton>
            </>
          )}
          {role === "user" && (
            <>
              <ListItemButton
                onClick={() => handleMenuClick("/available-books")}
              >
                <ListItemIcon>
                  <LibraryBooksIcon />
                </ListItemIcon>
                <ListItemText>Available Books</ListItemText>
              </ListItemButton>
              <ListItemButton onClick={() => handleMenuClick("/profile")}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </ListItemButton>
            </>
          )}
          {role ? (
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </ListItemButton>
          ) : (
            <>
              <ListItemButton onClick={() => handleMenuClick("/register")}>
                <ListItemIcon>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText>Register</ListItemText>
              </ListItemButton>
              <ListItemButton onClick={() => handleMenuClick("/login")}>
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText>Login</ListItemText>
              </ListItemButton>
            </>
          )}
        </List>
      </Drawer>
      <IconButton
        sx={{ color: "#171b45", marginLeft: "auto" }}
        onClick={() => setOpenMenu(!openMenu)}
      >
        <MenuIcon />
      </IconButton>
    </>
  );
};

export default MobileMenu;
