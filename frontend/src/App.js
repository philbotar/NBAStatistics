import React from "react";
import "./App.css";
import Appbar from "./components/Appbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import PlayerPage from "./pages/PlayerPage";
import TeamPage from "./pages/TeamPage";

function App() {
  return (
    <Router>
      <Appbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route
          exact
          path="/team/:teamName/player/:id"
          element={<PlayerPage />}
        />
        <Route exact path="/team/:id" element={<TeamPage />} />
      </Routes>
    </Router>
  );
}

export default App;
