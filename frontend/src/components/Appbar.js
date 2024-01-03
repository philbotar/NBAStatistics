import React, { useState, useEffect } from "react";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

const Appbar = () => {
  const [nbaTeams, setNbaTeams] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [season, setSeason] = useState(
    localStorage.getItem("selectedSeason") || "",
  );
  const [seasons, setSeasons] = useState([]);
  const open = Boolean(anchorEl);

  useEffect(() => {
    axios
      .get("http://0.0.0.0:8000/api/nba-teams/")
      .then((response) => setNbaTeams(response.data))
      .catch((error) => console.error("Error fetching NBA teams:", error));

    const currentYear = new Date().getFullYear();
    const startYear = 1946;
    const generatedSeasons = [];
    for (let year = startYear; year <= currentYear; year++) {
      generatedSeasons.push(`${year}-${String(year + 1).slice(2)}`);
    }
    setSeasons(generatedSeasons.reverse());

    const savedSeason = localStorage.getItem("selectedSeason");
    if (savedSeason) {
      setSeason(savedSeason);
    }
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSeasonChange = (event) => {
    const selectedSeason = event.target.value;
    setSeason(selectedSeason);
    localStorage.setItem("selectedSeason", selectedSeason);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          NBA Statistics
        </Typography>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="season-select-label">Season</InputLabel>
          <Select
            labelId="season-select-label"
            id="season-select"
            value={season}
            onChange={handleSeasonChange}
            label="Season"
          >
            {seasons.map((season) => (
              <MenuItem key={season} value={season}>
                {season}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <IconButton
          size="large"
          edge="end"
          color="inherit"
          aria-label="menu"
          onClick={handleMenu}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={open}
          onClose={handleClose}
        >
          <Grid container spacing={1}>
            {nbaTeams.map((team) => (
              <Grid item xs={6} sm={3} key={team.id}>
                <Link
                  to={"/team/" + team.id}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <MenuItem onClick={handleClose}>{team.full_name}</MenuItem>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Appbar;
