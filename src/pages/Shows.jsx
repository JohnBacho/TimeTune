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
}) {
  const [error, setError] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [fade, setFade] = useState(true);
  const [flip, setFlip] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [counter, setCounter] = useState(0);

  let Color = isCorrect === null ? "white" : isCorrect ? "green" : "red";

  async function fetchShows() {
    try {
      setError(null);

      const randomPage = Math.floor(Math.random() * 65) + 1;
      const token = await getToken();
      const URL = `https://api4.thetvdb.com/v4/series/filter?country=usa&lang=eng&sort=score&sortType=desc&page=${randomPage}`;

      const res = await fetch(URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": "eng",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.data && data.data.length > 0) {
        let startIndex = Math.floor(Math.random() * data.data.length);
        for (let i = 0; i < data.data.length; i++) {
          const randomShow = data.data[(startIndex + i) % data.data.length];
          if (
            randomShow.image === null ||
            randomShow.year === null ||
            randomShow.year === "" ||
            randomShow.score < 350 ||
            randomShow.name === "WWE Superstar Ink"
          ) {
            continue;
          }
          const normalizedShow = {
            id: randomShow.id,
            name: randomShow.name.replace(/\s*\([^)]*\)/g, ""),
            release_date: randomShow.year,
            poster_path: randomShow.image,
            rating: randomShow.score,
          };
          return normalizedShow;
        }
        return fetchShows();
      } else {
        return fetchShows();
      }
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    if (Shows === null) {
      async function loadShow() {
        const [current, next] = await Promise.all([fetchShows(), fetchShows()]);

        setShows(current);
        setNextShows(next);
      }

      loadShow();
    }
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    const inputValue = event.target.elements[0].value.trim();
    const isCorrect = Shows.release_date === inputValue;

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

  if (error) return <p>Error: {error}</p>;
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
