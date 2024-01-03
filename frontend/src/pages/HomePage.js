import React from "react";
import PropTypes from "prop-types";
import { Typography, Box } from "@mui/material";

const App = ({ teams }) => {
  return (
    <header className="content">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          padding: 2,
        }}
      >
        <Typography variant="h1" align="center">
          Welcome to NBA Statistics
        </Typography>
        <Typography variant="h4" align="center">
          This website is a clone of the NBA website, holding player, team, and
          game statistics. It utilizes Chart.js and React to show the statistics
          of a game.
        </Typography>
      </Box>
    </header>
  );
};

App.propTypes = {
  teams: PropTypes.array.isRequired,
};

export default App;
