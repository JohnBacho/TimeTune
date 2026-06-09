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
}) {
  const [error, setError] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [fade, setFade] = useState(true);
  const [flip, setFlip] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  let Color = isCorrect === null ? "white" : isCorrect ? "green" : "red";

  const API_KEY = import.meta.env.VITE_AUDIODB_API_KEY || "2";

  async function fetchMusic() {
    try {
      setError(null);
      const randomArtistId = Math.floor(Math.random() * 1500) + 111200;

      const URL = `https://www.theaudiodb.com/api/v1/json/${API_KEY}/album.php?i=${randomArtistId}`;
      const response = await fetch(URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.album && data.album.length > 0) {
        let startIndex = Math.floor(Math.random() * data.album.length);
        for (let i = 0; i < data.album.length; i++) {
          const randomAlbum = data.album[(startIndex + i) % data.album.length];
          if (
            calculatePopularityScore(randomAlbum) < 50 ||
            randomAlbum.intYearReleased.length != 4 ||
            !randomAlbum.strAlbumThumb
          ) {
            continue;
          }
          const normalizedAlbum = {
            id: randomAlbum.idAlbum,
            name: randomAlbum.strAlbum,
            title: randomAlbum.strAlbum,
            artist: randomAlbum.strArtist,
            release_date: String(randomAlbum.intYearReleased),
            poster_path: randomAlbum.strAlbumThumb || "",
            ...randomAlbum,
          };
          return normalizedAlbum;
        }
        return fetchMusic();
      } else {
        return fetchMusic();
      }
    } catch (err) {
      setError(err.message);
    }
  }

  function calculatePopularityScore(album) {
    let score = 0;

    score += Number(album.intScore || 0) * 2;
    score += Number(album.intScoreVotes || 0) * 5;

    if (album.strWikipediaID) score += 20;
    if (album.strDiscogsID) score += 10;
    if (album.strDescription) score += 10;
    if (album.strReview) score += 10;

    if (album.strArtist) score += 15;

    return score;
  }

  useEffect(() => {
    if (music === null) {
      async function loadMusic() {
        const [current, next] = await Promise.all([fetchMusic(), fetchMusic()]);

        setMusic(current);
        setNextMusic(next);
      }

      loadMusic();
    }
  }, []);

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

  if (error) return <p>Error: {error}</p>;
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
