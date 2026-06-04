import MediaSection from "../components/MediaSection";
import GuessForm from "../components/GuessForm";
import Score from "../components/Score";

import NavBar from "../components/NavBar";
import "./Media.css";
import React, { useState, useEffect } from "react";

export default function Movie({ movieScore, setMovieScore }) {
  const [movies, setMovies] = useState(null);
  const [nextMovies, setNextMovies] = useState(null);
  const [error, setError] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [fade, setFade] = useState(true);
  const [flip, setFlip] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  let Color = isCorrect === null ? "white" : isCorrect ? "green" : "red";

  const API_TOKEN = import.meta.env.VITE_MY_API_KEY;

  async function fetchMovies() {
    try {
      setError(null);

      const randomPage = Math.floor(Math.random() * 500) + 1;

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
        const normalizedMovie = {
          id: randomMovie.id,
          name: randomMovie.title,
          release_date: randomMovie.release_date.trim().slice(0, 4),
          poster_path:
            "https://image.tmdb.org/t/p/w500" + randomMovie.poster_path,
          rating: randomMovie.vote_average,
        };
        if (
          randomMovie.adult === true ||
          randomMovie.softcore === true ||
          randomMovie.vote_count < 350
        ) {
          return fetchMovies();
        } else {
          return normalizedMovie;
        }
      } else {
        throw new Error("No movies found.");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    async function loadMovie() {
      const current = await fetchMovies();
      const next = await fetchMovies();

      setMovies(current);
      setNextMovies(next);
    }

    loadMovie();
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
      setMovieScore((prevScore) => prevScore + 1);
    } else {
      setIsCorrect(false);
    }

    setTimeout(() => {
      setFlip(true);
    }, 250);
    setTimeout(() => {
      setFade(false);
      setFlip(false);
    }, 2500);
    setTimeout(async () => {
      setFade(true);
      setIsCorrect(null);
      setMovies(nextMovies);

      event.target.reset();
      setIsSubmitting(false);
      const freshMovie = await fetchMovies();
      setNextMovies(freshMovie);
    }, 3000);
  }

  if (error) return <p>Error: {error}</p>;
  if (!movies) return <p>Loading...</p>;

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
        <NavBar />
        <Score score={movieScore} />
        <div key={movies.id}>
          <MediaSection
            media={movies}
            fade={fade}
            flip={flip}
            isCorrect={isCorrect}
            isMovie={true}
          />
          <GuessForm
            onSubmit={handleSubmit}
            color={Color}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
