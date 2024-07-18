import React, { useContext, useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import FeedbackIcon from "@mui/icons-material/Feedback";
import SearchIcon from "@mui/icons-material/Search";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from "@mui/icons-material/Logout";
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
          sx: { width: "50%" },
        }}
        open={openMenu}
        onClose={() => setOpenMenu(false)}
      >
        <List>
          <ListItemButton onClick={() => handleMenuClick("/")}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText>Home</ListItemText>
          </ListItemButton>
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
              <ListItemButton onClick={() => handleMenuClick("/search")}>
                <ListItemIcon>
                  <SearchIcon />
                </ListItemIcon>
                <ListItemText>Search</ListItemText>
              </ListItemButton>
              <ListItemButton
                onClick={() => handleMenuClick("/available-books")}
              >
                <ListItemIcon>
                  <LibraryBooksIcon />
                </ListItemIcon>
                <ListItemText>Search</ListItemText>
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
        sx={{ color: "white", marginLeft: "auto" }}
        onClick={() => setOpenMenu(!openMenu)}
      >
        <MenuIcon />
      </IconButton>
    </>
  );
};

export default MobileMenu;
