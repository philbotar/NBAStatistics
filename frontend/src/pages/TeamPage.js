import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Paper, Typography, Grid, Card, CardContent, Box } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import "../App.css";
import { Avatar } from "@mui/material"; // Add import at the top

const cellStyle = {
  width: "25%",
};

function TeamPage() {
  const { id } = useParams();
  const [players, setPlayers] = useState([]);
  const [teamDetails, setTeamDetails] = useState({
    teamName: "",
    gameLog: [],
  });

  useEffect(() => {
    axios
      .get(`http://0.0.0.0:8000/api/team/${id}/`)
      .then((res) => {
        const updatedPlayers = res.data.roster.map((player, i) => ({
          ...player,
          full_name: `${res.data.roster[i][3]}`,
        }));
        setPlayers(updatedPlayers);
        setTeamDetails({
          teamName: res.data.team.full_name, // updated line
          gameLog: res.data.game_log.slice(0, 10),
        });
      })
      .catch((err) => console.log(err));
  }, [id]);

  const renderPlayerList = players.map((player, index) => (
    <Grid item xs={12} sm={6} md={4} key={index}>
      <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
        <Avatar
          src={`https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${player[14]}.png`}
          sx={{ width: 56, height: 56, marginRight: 2 }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Link
            to={`/team/${teamDetails.teamName}/player/${player[14]}/`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography variant="subtitle1">{player.full_name}</Typography>

          </Link>
        </Box>
      </Card>
    </Grid>
  ));

  return (
    <Paper sx={{ width: "100%", minHeight: "100vh", overflowY: "auto", p: 2 }}>
      <Typography variant="h4" mb={3} align="center">
        {teamDetails.teamName}
      </Typography>
      <Grid container spacing={3}>
        <Grid item sm={6}>
          <Typography variant="h6" gutterBottom>
            Last 10 Games
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {teamDetails.gameLog.map((game, index) => (
              <Card
                key={index}
                sx={{
                  flex: "0 1 calc(50% - 16px)",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1">{game.MATCHUP}</Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    {game.GAME_DATE}
                  </Typography>
                </CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    paddingRight: 2,
                  }}
                >
                  <Typography variant="h6">
                    {game.PTS} - {game.OPP_SCORE}
                  </Typography>
                </Box>
              </Card>
            ))}
          </Box>
        </Grid>
        <Grid item sm={6}>
          <Typography variant="h6" gutterBottom>
            Players
          </Typography>
          <Grid container spacing={2}>
            {renderPlayerList}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default TeamPage;
