import React, { Component } from "react";
import {
  Paper,
  TableCell,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import "../App.css";

const cellStyle = {
  width: "25%",
};

class TeamCard extends Component {
  state = {
    id: null,
    players: [],
    teamName: "",
    game_log: [],
    stats_covered: {
      PPG: 0,
      APG: 0,
      RPG: 0,
      ThreePM: 0,
    },
  };

  componentDidUpdate(prevProps) {
    if (this.props.selectedTeam !== prevProps.selectedTeam) {
      this.fetchPlayers(this.props.selectedTeam);
    }
  }

  fetchPlayers = (id) => {
    this.setState({ id: id });
    axios
      .get(`http://0.0.0.0:8000/api/team/${id}/`, this.state.stats_covered)
      .then((res) => {
        for (let i = 0; i < res.data.roster.length; i++) {
          res.data.roster[i].full_name = `${res.data.roster[i][3]}`;
        }
        this.setState({
          players: res.data.roster,
          teamName: res.data.team,
          game_log: res.data.game_log.slice(0, 10),
        });
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  };

  renderPlayerList = () => {
    let rows = [];
    let row = [];
    for (let i = 0; i < this.state.players.length; i++) {
      row.push(this.state.players[i]);
      if (row.length === 4) {
        rows.push(row);
        row = [];
      }
    }
    if (row.length > 0) {
      rows.push(row);
    }
    return rows.map((row) => {
      return (
        <TableRow>
          {row.map((player) => {
            return <TableCell style={cellStyle}>{player.full_name}</TableCell>;
          })}
        </TableRow>
      );
    });
  };

  render() {
    return (
      <Paper
        sx={{ width: "100%", maxHeight: "100vh", overflowY: "auto", p: 2 }}
      >
        <Typography variant="h4" mb={3} align="center">
          {this.state.teamName.full_name}
        </Typography>
        <Grid container spacing={3}>
          <Grid item sm={6}>
            <Typography variant="h6" gutterBottom>
              Last 10 Games
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {this.state.game_log.map((game, index) => (
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
              Players in Past 10
            </Typography>
            <Grid container spacing={2}>
              {this.state.players.map((player, index) => (
                <Grid item sm={6} key={index}>
                  <Link
                    to={`/team/${this.state.teamName.full_name}/player/${player[14]}/`}
                  >
                    {player.full_name}
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

export default TeamCard;
