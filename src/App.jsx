import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Details from "./pages/Details";
import Player from "./pages/Player";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path=":mediaType/:id" element={<Details />} />
      <Route path="play" element={<Player />} />
    </Routes>
  );
}
