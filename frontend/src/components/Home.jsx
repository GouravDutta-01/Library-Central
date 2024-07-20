import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/system";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import SearchIcon from "@mui/icons-material/Search";
import RateReviewIcon from "@mui/icons-material/RateReview";
import backgroundImage from "../images/background.jpg";

const features = [
  {
    title: "Manage E-books",
    description:
      "Librarians can create and delete e-books within various sections of the library.",
    icon: <LibraryBooksIcon sx={{ fontSize: 40, color: "#0c174a" }} />,
  },
  {
    title: "User Account Management",
    description:
      "Librarians can manage user accounts, roles, and monitor user activity.",
    icon: <ManageAccountsIcon sx={{ fontSize: 40, color: "#0c174a" }} />,
  },
  {
    title: "Grant/Revoke Access",
    description:
      "Librarians can handle the issuing and returning process of e-books for users.",
    icon: <ImportContactsIcon sx={{ fontSize: 40, color: "#0c174a" }} />,
  },
  {
    title: "Search Library Catalog",
    description:
      "Users can easily search for e-books and resources available in the library.",
    icon: <SearchIcon sx={{ fontSize: 40, color: "#0c174a" }} />,
  },
  {
    title: "Request E-books",
    description:
      "Users can request access to e-books and manage their requests.",
    icon: <ImportContactsIcon sx={{ fontSize: 40, color: "#0c174a" }} />,
  },
  {
    title: "Rate and Review E-books",
    description: "Users can rate and review e-books they have read.",
    icon: <RateReviewIcon sx={{ fontSize: 40, color: "#0c174a" }} />,
  },
];

const BackgroundSection = styled(Box)(({ theme }) => ({
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  textAlign: "center",
  padding: "0 20px",
}));

const FeaturesSection = styled(Box)({
  padding: "40px 0",
  backgroundColor: "#f4f4f4",
});

const FeatureCard = styled(Card)({
  display: "flex",
  alignItems: "center",
  padding: "20px",
  textAlign: "left",
  borderRadius: "16px",
  backgroundColor: "#a6dcef",
  color: "#0c174a",
  transition: "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
  "&:hover": {
    backgroundColor: "#0c174a",
    color: "#ffffff",
  },
});

const Home = () => {
  return (
    <div>
      <BackgroundSection>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            fontFamily: "Poppins, sans-serif",
            background: "linear-gradient(to right, #5868f5, #020a21)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            WebkitTextStroke: "1px white",
          }}
        >
          Welcome to Library Central
        </Typography>
      </BackgroundSection>
      <FeaturesSection>
        <Container sx={{ marginBottom: 10 }}>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} key={index}>
                <FeatureCard>
                  <Avatar
                    sx={{ bgcolor: "#ffffff", mr: 2, width: 60, height: 60 }}
                  >
                    {feature.icon}
                  </Avatar>
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        fontWeight: "bold",
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </FeaturesSection>
    </div>
  );
};

export default Home;
