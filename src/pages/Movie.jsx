import MediaSection from "../components/MediaSection";
import GuessForm from "../components/GuessForm";
import Score from "../components/Score";
import Spinner from "../components/Spinner";

import NavBar from "../components/NavBar";
import "./Media.css";
import React, { useState, useEffect } from "react";

export default function Movie({
  movieScore,
  setMovieScore,
  movies,
  setMovies,
  nextMovies,
  setNextMovies,
  fetchMovies,
}) {
  const [isCorrect, setIsCorrect] = useState(null);
  const [fade, setFade] = useState(true);
  const [flip, setFlip] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  let Color = isCorrect === null ? "white" : isCorrect ? "green" : "red";

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
      if (!nextMovies) {
        setIsLoadingNext(true);
        return;
      }
      setFade(true);
      setIsCorrect(null);
      setMovies(nextMovies);

      event.target.reset();
      setIsSubmitting(false);
      const freshMovie = await fetchMovies();
      setNextMovies(freshMovie);
    }, 3000);
  }

  useEffect(() => {
    if (isLoadingNext && nextMovies) {
      setIsLoadingNext(false);
      setFade(true);
      setIsCorrect(null);
      setMovies(nextMovies);
      setNextMovies(null);
      setIsSubmitting(false);

      fetchMovies().then(setNextMovies);
    }
  }, [nextMovies, isLoadingNext]);

  useEffect(() => {
    if (nextMovies?.poster_path) {
      const img = new Image();
      img.src = nextMovies.poster_path;
    }
  }, [nextMovies]);

  if (!movies) return <Spinner />;

  const imageUrl = movies.poster_path ?? "";

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
