import React from "react";
import { Typography } from "@mui/material";

const Footer = () => {
  return (
    <footer
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        backgroundColor: "#f0f0f0",
        textAlign: "center",
        padding: "10px 0",
        marginTop: "10px",
        borderTop: "1px solid #ddd",
      }}
    >
      <Typography variant="body2" color="textSecondary">
        © {new Date().getFullYear()} Library Management System. All rights
        reserved.
      </Typography>
    </footer>
  );
};

export default Footer;
