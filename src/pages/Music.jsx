import MediaSection from "../components/MediaSection";
import GuessForm from "../components/GuessForm";
import Score from "../components/Score";
import Spinner from "../components/Spinner";

import NavBar from "../components/NavBar";
import "./Media.css";
import React, { useState, useEffect, useRef } from "react";

export default function Music({
  musicScore,
  setMusicScore,
  music,
  setMusic,
  nextMusic,
  setNextMusic,
  fetchMusic,
}) {
  const [isCorrect, setIsCorrect] = useState(null);
  const [fade, setFade] = useState(true);
  const [flip, setFlip] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  let Color = isCorrect === null ? "white" : isCorrect ? "green" : "red";

  useEffect(() => {
    if (nextMusic?.poster_path) {
      const img = new Image();
      img.src = nextMusic.poster_path;
    }
  }, [nextMusic]);

  function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    const inputValue = event.target.elements[0].value.trim();
    const year = music?.release_date?.toString();

    const correct = year === inputValue;

    if (correct) {
      setIsCorrect(true);
      setMusicScore((prevScore) => prevScore + 1);
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
      if (!nextMusic) {
        setIsLoadingNext(true);
        return;
      }
      setFade(true);
      setIsCorrect(null);
      setMusic(nextMusic);
      event.target.reset();
      setIsSubmitting(false);
      const freshAlbum = await fetchMusic();
      setNextMusic(freshAlbum);
    }, 3000);
  }

  useEffect(() => {
    if (isLoadingNext && nextMusic) {
      setIsLoadingNext(false);
      setFade(true);
      setIsCorrect(null);
      setMusic(nextMusic);
      setNextMusic(null);
      setIsSubmitting(false);

      fetchMusic().then(setNextMusic);
    }
  }, [nextMusic, isLoadingNext]);

  if (!music) return <Spinner />;

  const imageUrl = music.poster_path;

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
        <Score score={musicScore} />
        <div key={music.id}>
          <MediaSection
            media={music}
            fade={fade}
            flip={flip}
            isCorrect={isCorrect}
            isMovie={false}
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
