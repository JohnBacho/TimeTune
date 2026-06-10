import "./App.css";
import { lazy, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { fetchMovies } from "./api/fetchMovies.js";
import { fetchShows, getToken } from "./api/fetchShows.js";
import { fetchMusic } from "./api/fetchMusic.js";

const Movie = lazy(() => import("./pages/Movie.jsx"));
const Music = lazy(() => import("./pages/Music.jsx"));
const Show = lazy(() => import("./pages/Shows.jsx"));

export default function App() {
  const [movieScore, setMovieScore] = useState(0);
  const [musicScore, setMusicScore] = useState(0);
  const [ShowScore, setTvScore] = useState(0);

  const [movies, setMovies] = useState(null);
  const [nextMovies, setNextMovies] = useState(null);

  const [Shows, setShows] = useState(null);
  const [nextShows, setNextShows] = useState(null);

  const [music, setMusic] = useState(null);
  const [nextMusic, setNextMusic] = useState(null);

  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMovies() {
      try {
        const [current, next] = await Promise.all([
          fetchMovies(),
          fetchMovies(),
        ]);
        setMovies(current);
        setNextMovies(next);
      } catch (err) {
        setError(err.message);
      }
    }
    loadMovies();
  }, []);

  useEffect(() => {
    if (movies === null) return;
    async function loadShows() {
      try {
        const [current, next] = await Promise.all([fetchShows(), fetchShows()]);
        setShows(current);
        setNextShows(next);
      } catch (err) {
        setError(err.message);
      }
    }
    loadShows();
  }, [movies]);

  useEffect(() => {
    if (movies === null) return;
    async function loadMusic() {
      try {
        const [current, next] = await Promise.all([fetchMusic(), fetchMusic()]);
        setMusic(current);
        setNextMusic(next);
      } catch (err) {
        setError(err.message);
      }
    }
    loadMusic();
  }, [movies]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Movie
              movieScore={movieScore}
              setMovieScore={setMovieScore}
              movies={movies}
              setMovies={setMovies}
              nextMovies={nextMovies}
              setNextMovies={setNextMovies}
              fetchMovies={fetchMovies}
            />
          }
        />
        <Route
          path="/music"
          element={
            <Music
              musicScore={musicScore}
              setMusicScore={setMusicScore}
              music={music}
              setMusic={setMusic}
              nextMusic={nextMusic}
              setNextMusic={setNextMusic}
              fetchMusic={fetchMusic}
            />
          }
        />
        <Route
          path="/Shows"
          element={
            <Show
              ShowScore={ShowScore}
              setShowScore={setTvScore}
              setShows={setShows}
              Shows={Shows}
              nextShows={nextShows}
              setNextShows={setNextShows}
              getToken={getToken}
              fetchShows={fetchShows}
            />
          }
        />
      </Routes>
    </Router>
  );
}
