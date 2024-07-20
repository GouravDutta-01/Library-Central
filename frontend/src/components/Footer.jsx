import React from "react";
import { Typography } from "@mui/material";

const Footer = () => {
  return (
    <footer
      style={{
        position: "relative",
        bottom: 0,
        width: "100%",
        backgroundColor: "#f0f0f0",
        textAlign: "center",
        padding: "10px 0",
        borderTop: "1px solid #ddd",
      }}
    >
      <Typography variant="body2" color="textSecondary" >
        © {new Date().getFullYear()} Library Central. All rights
        reserved.
      </Typography>
    </footer>
  );
};

export default Footer;
