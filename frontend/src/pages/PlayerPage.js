import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Box,
  Collapse,
  Container,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Avatar,
  TextField,
  InputAdornment,
} from "@mui/material";
import moment from "moment";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { ButtonBase } from "@mui/material"; // Add import here
const STATS = [
  "MIN",
  "PTS",
  "REB",
  "AST",
  "FG3M",
  "FG3A",
  "FG3_PCT",
  "FGA",
  "FGM",
  "FG_PCT",
  "FTA",
  "FTM",
  "FT_PCT",
  "OREB",
  "DREB",
  "PF",
  "PLUS_MINUS",
  "STL",
  "BLK",
  "TOV",
];

function PlayerPage() {
  const { id, teamName } = useParams();
  const [player, setPlayer] = useState(null);
  const [openIndex, setOpenIndex] = useState(-1);
  const [selectedStat, setSelectedStat] = useState(""); // Add state for selected statistic
  const [selectedGame, setSelectedGame] = useState(-1); // Add state for selected Game
  const [showStats] = useState(true); // Add this line to add state for showing stats
  const [showAvg] = useState(false); // Add this line to add state for running average visibility
  const [comparisonVal, setComparisonVal] = useState(0); // Add this line to add state for comparison value

  useEffect(() => {
    axios
      .get(`http://0.0.0.0:8000/api/team/${teamName}/player/${id}/`)
      .then((res) => {
        setPlayer(res.data);
      })
      .catch((err) => console.log(err));
  }, [id, teamName]);

  if (!player) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "100vh" }}
      >
        <CircularProgress />
      </Grid>
    );
  }

  const handleClick = (index, stat) => {
    setOpenIndex(index);
    setSelectedStat(stat);
    setSelectedGame(index);
    setComparisonVal(null); // Reset comparison value when a new stat is clicked
  };

  const setComparison = (val) => {
    setComparisonVal(val || null); // If val is 0 or undefined, set comparisonVal to null
  };

  const { name, team, last_10_games, info } = player;

  const exceededCount = comparisonVal
    ? last_10_games
        .map((game) => game[selectedStat])
        .filter((val) => val > comparisonVal).length
    : 0;
  const runningAvg = (arr) => {
    let result = [];
    let runningSum = 0;
    for (let i = 0; i < arr.length; i++) {
      runningSum += arr[i];
      result[i] = runningSum / (i + 1);
    }
    return result;
  };

  const chartData = {
    labels: last_10_games.map((game) => game.GAME_DATE),
    datasets: [
      {
        label: selectedStat,
        data: last_10_games.map((game) => game[selectedStat]),
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(255,0,0, 1)",
        pointRadius: last_10_games.map((_, i) => (i === selectedGame ? 5 : 0)), // Only show the point for the selected game
        pointBackgroundColor: last_10_games.map(
          (_, i) => (i === selectedGame ? "rgba(255,0,0, 1)" : "rgba(0,0,0,0)"), // Red for selected game, transparent for all others
        ),
      },
      {
        label: "Running Avg",
        data: runningAvg(last_10_games.map((game) => game[selectedStat])),
        fill: false,
        backgroundColor: "rgb(75, 75, 192)",
        borderColor: "rgba(0,0,255,1)",
      },
      ...(comparisonVal !== null
        ? [
            {
              label: `Comparison Line (${exceededCount} / ${last_10_games.length})`,
              data: Array(last_10_games.length).fill(comparisonVal),
              fill: false,
              backgroundColor: "rgb(192, 75, 75)",
              borderColor: "rgba(0, 0, 0, 1)",
              pointRadius: 0, // this line effectively hides the points on the line
            },
          ]
        : []),
    ],
  };

  const playerImage = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${id}.png`; // Player image URL

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container>
        <Grid item>
          <Avatar src={playerImage} sx={{ width: 100, height: 100 }} />{" "}
        </Grid>
        <Grid item>
          <Typography variant="h3" align="center" noWrap>
            {name ? name.full_name : ""}
          </Typography>
          <Typography variant="h5" align="center" noWrap color="textSecondary">
            {team}
          </Typography>
          {info && (
            <Typography
              variant="h6"
              align="center"
              noWrap
              color="textSecondary"
            >
              {`Height: ${info[11]}, Weight: ${info[12]}, Age: ${moment().diff(
                info[7],
                "years",
              )}`}
            </Typography>
          )}
        </Grid>
      </Grid>
      <TableContainer
        component={Paper}
        sx={{ overflow: "auto", bgcolor: "#F5F5F5" }}
      >
        <Table sx={{ borderCollapse: "collapse", minWidth: 700 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#D3D3D3" }}>
              <TableCell
                sx={{ fontSize: 10, fontWeight: "bold", padding: "10px" }}
              >
                Date
              </TableCell>
              <TableCell
                sx={{ fontSize: 10, fontWeight: "bold", padding: "10px" }}
              >
                Match-Up
              </TableCell>
              {STATS.map((stat) => (
                <TableCell
                  key={stat}
                  sx={{ fontSize: 10, fontWeight: "bold", padding: "10px" }}
                >
                  {stat !== "PLUS_MINUS" ? stat.replace("_", " ") : "+/-"}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {last_10_games.map((game, index) => (
              <React.Fragment key={index}>
                <TableRow
                  sx={{ "&:nth-of-type(odd)": { backgroundColor: "#FAFAFA" } }}
                >
                  <TableCell sx={{ fontSize: 10, padding: "10px" }}>
                    {game.GAME_DATE}
                  </TableCell>
                  <TableCell sx={{ fontSize: 10, padding: "10px" }}>
                    {game.MATCHUP}
                  </TableCell>
                  {STATS.map((stat) => (
                    <TableCell
                      key={stat}
                      sx={{ fontSize: 10, padding: "10px" }}
                    >
                      <ButtonBase
                        style={{ width: "100%" }}
                        onClick={() => handleClick(index, stat)}
                      >
                        {game[stat]}
                      </ButtonBase>
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={STATS.length + 2}
                  >
                    <Collapse
                      in={openIndex === index}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box margin={1}>
                        <Typography
                          variant="h6"
                          gutterBottom
                          component="div"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          {`${game.GAME_DATE} - ${selectedStat}`}
                          <TextField
                            label="Comparison Value"
                            type="number"
                            onChange={(e) =>
                              setComparison(parseFloat(e.target.value))
                            }
                            id="standard-size-normal"
                            defaultValue="Normal"
                            variant="standard"
                            sx={{ m: 1, width: "25ch" }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  {selectedStat}
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Typography>
                        <Line data={chartData} />
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default PlayerPage;
