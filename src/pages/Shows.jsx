import MediaSection from "../components/MediaSection";
import GuessForm from "../components/GuessForm";
import Score from "../components/Score";
import Spinner from "../components/Spinner";
import NavBar from "../components/NavBar";
import "./Media.css";
import React, { useState, useEffect } from "react";

export default function Show({
  ShowScore,
  setShowScore,
  setShows,
  Shows,
  setNextShows,
  nextShows,
  getToken,
  fetchShows,
}) {
  const [isCorrect, setIsCorrect] = useState(null);
  const [fade, setFade] = useState(true);
  const [flip, setFlip] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [counter, setCounter] = useState(0);

  let Color = isCorrect === null ? "white" : isCorrect ? "green" : "red";

  function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    const inputValue = event.target.elements[0].value.trim();
    const isCorrect = Shows?.release_date === inputValue;

    if (isCorrect) {
      setIsCorrect(true);
      setShowScore((prev) => prev + 1);
    } else {
      setIsCorrect(false);
    }

    setTimeout(() => setFlip(true), 250);
    setTimeout(() => {
      setFade(false);
      setFlip(false);
    }, 2500);

    setTimeout(async () => {
      if (!nextShows) {
        setIsLoadingNext(true);
        return;
      }
      setFade(true);
      setIsCorrect(null);
      setShows(nextShows);
      setNextShows(null);
      event.target.reset();
      setIsSubmitting(false);

      const fresh = await fetchShows();
      setNextShows(fresh);
    }, 3000);
  }

  useEffect(() => {
    if (isLoadingNext && nextShows) {
      setIsLoadingNext(false);
      setFade(true);
      setIsCorrect(null);
      setShows(nextShows);
      setNextShows(null);
      setIsSubmitting(false);

      fetchShows().then(setNextShows);
    }
  }, [nextShows, isLoadingNext]);

  useEffect(() => {
    if (nextShows?.poster_path) {
      const img = new Image();
      img.src = nextShows.poster_path;
    }
  }, [nextShows]);

  if (!Shows) return <Spinner />;

  return (
    <div className="App">
      <div
        className={"bg-layer " + (fade ? "fade-in" : "fade-out")}
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url(${Shows.poster_path})`,
        }}
      />

      <div className="content">
        <NavBar />
        <Score score={ShowScore} />
        <div key={Shows.id}>
          <MediaSection
            media={Shows}
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
