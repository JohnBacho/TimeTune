import MoviePoster from "./components/MoviePoster";
import MovieInfo from "./components/MovieInfo";
import "./App.css";
import React, { useState, useEffect } from "react";

export default function App() {
  const [movies, setMovies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [fade, setFade] = useState(true);
  const [flip, setFlip] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  let Color = isCorrect === null ? "white" : isCorrect ? "green" : "red";

  const API_TOKEN = import.meta.env.VITE_MY_API_KEY;

  async function fetchMovies() {
    try {
      setLoading(true);
      setError(null);

      const randomPage = Math.floor(Math.random() * 150) + 1;

      const URL = `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${randomPage}&include_adult=false`;
      const response = await fetch(URL, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const randomMovie =
          data.results[Math.floor(Math.random() * data.results.length)];
        if (randomMovie.adult === true) {
          return fetchMovies();
        } else {
          setMovies(randomMovie);
          setFade(true);
        }
      } else {
        throw new Error("No movies found.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    const inputValue = event.target.elements[0].value.trim();
    const year = movies?.release_date
      ? movies.release_date.trim().slice(0, 4)
      : "";

    const isCorrect = year === inputValue;

    if (isCorrect) {
      setIsCorrect(true);
      setScore((prevScore) => prevScore + 1);
    } else {
      setIsCorrect(false);
    }

    setTimeout(() => {
      setFlip(true);
    }, 250);
    setTimeout(() => {
      setFade(false);
    }, 2500);
    setTimeout(() => {
      setFlip(false);
      setIsCorrect(null);
      fetchMovies();
      event.target.reset();
      setIsSubmitting(false);
    }, 3000);
  }

  {
    loading ? <p>Loading next movie...</p> : <MoviePoster movies={movies} />;
  }
  if (error) return <p>Error: {error}</p>;
  if (!movies) return <p>No movie data available.</p>;

  const imageUrl = movies.poster_path
    ? `https://image.tmdb.org/t/p/w500${movies.poster_path}`
    : "";

  return (
    <div className="App">
      <div
        className={"bg-layer " + (fade ? "fade-in" : "fade-out")}
        style={{
          backgroundImage: imageUrl
            ? `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url(${imageUrl})`
            : "none",
        }}
      />
      <div className="content">
        <h1>Movie Trivia</h1>
        <div className="score">Score: {score}</div>

        <div key={movies.id}>
          <div className={`${fade ? "fade-in" : "fade-out"}`}>
            <MoviePoster movies={movies} flip={flip} isCorrect={isCorrect} />
            <MovieInfo movies={movies} />
          </div>
          <div className="movie-input">
            <form onSubmit={handleSubmit}>
              <input
                style={{ border: `2px solid ${Color}` }}
                type="tel"
                placeholder="Release year..."
                required
                autoFocus
                disabled={isSubmitting}
                maxlength="4"
              />
              <button
                style={{ border: `2px solid ${Color}` }}
                disabled={isSubmitting}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
