import MediaSection from "../components/MediaSection";
import GuessForm from "../components/GuessForm";
import Score from "../components/Score";

import NavBar from "../components/NavBar";
import "./Media.css";
import React, { useState, useEffect, useRef } from "react";

export default function Music({ musicScore, setMusicScore }) {
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [fade, setFade] = useState(true);
  const [flip, setFlip] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mediaRef = useRef(null);
  let Color = isCorrect === null ? "white" : isCorrect ? "green" : "red";

  const API_KEY = import.meta.env.VITE_AUDIODB_API_KEY || "2";

  async function fetchMusic() {
    try {
      setLoading(true);
      setError(null);
      const randomArtistId = Math.floor(Math.random() * 1500) + 111000;

      const URL = `https://www.theaudiodb.com/api/v1/json/${API_KEY}/album.php?i=${randomArtistId}`;
      const response = await fetch(URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.album && data.album.length > 0) {
        const randomAlbum =
          data.album[Math.floor(Math.random() * data.album.length)];
        const normalizedAlbum = {
          id: randomAlbum.idAlbum,
          name: randomAlbum.strAlbum,
          title: randomAlbum.strAlbum,
          artist: randomAlbum.strArtist,
          release_date: randomAlbum.intYearReleased
            ? String(randomAlbum.intYearReleased)
            : "",
          poster_path: randomAlbum.strAlbumThumb || "",
          ...randomAlbum,
        };

        mediaRef.current = normalizedAlbum;
        setMedia(normalizedAlbum);
        setFade(true);
        setLoading(false);
      } else {
        fetchMusic();
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMusic();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    const inputValue = event.target.elements[0].value.trim();
    const year = mediaRef.current?.release_date?.toString();
    console.log("Input Value:", inputValue);  
    console.log("Actual Year:", year);

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
    }, 2500);
    setTimeout(() => {
      setFlip(false);
      setIsCorrect(null);
      fetchMusic();
      event.target.reset();
      setIsSubmitting(false);
    }, 3000);
  }

  if (loading && !media) return <p>Loading next album...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!media) return <p>No music data available.</p>;

  const imageUrl = media.poster_path || fetchMusic();

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
        <div key={media.id}>
          <MediaSection
            media={media}
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
