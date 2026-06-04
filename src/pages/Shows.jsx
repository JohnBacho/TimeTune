import MediaSection from "../components/MediaSection";
import GuessForm from "../components/GuessForm";
import Score from "../components/Score";
import Spinner from "../components/Spinner";
import NavBar from "../components/NavBar";
import "./Media.css";
import React, { useState, useEffect } from "react";

export default function tv({ tvScore, settvScore }) {
  const [tvs, settvs] = useState(null);
  const [nexttvs, setNexttvs] = useState(null);
  const [error, setError] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [fade, setFade] = useState(true);
  const [flip, setFlip] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  let Color = isCorrect === null ? "white" : isCorrect ? "green" : "red";

  let cachedToken = null;

  async function getToken() {
    if (cachedToken) return cachedToken;
    const res = await fetch("https://api4.thetvdb.com/v4/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apikey: import.meta.env.VITE_MY_API_KEY_TV }),
    });
    const {
      data: { token },
    } = await res.json();
    cachedToken = token;
    return token;
  }

  async function fetchtvs() {
    try {
      setError(null);

      const randomPage = Math.floor(Math.random() * 70) + 1;
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
      console.log(data);
      if (data.data && data.data.length > 0) {
        let startIndex = Math.floor(Math.random() * data.data.length);
        console.log(data.data.length);
        for (let i = 0; i < data.data.length; i++) {
          const randomtv = data.data[(startIndex + i) % data.data.length];
          console.log(randomtv);
          if (
            randomtv.image === null ||
            randomtv.year === null ||
            randomtv.score < 350 ||
            randomtv.name === "WWE Superstar Ink"
          ) {
            continue;
          }
          const normalizedtv = {
            id: randomtv.id,
            name: randomtv.name,
            release_date: randomtv.year,
            poster_path: randomtv.image,
          };
          return normalizedtv;
        }
        return fetchtvs();
      } else {
        return fetchtvs();
      }
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    async function loadtv() {
      const current = await fetchtvs();
      const next = await fetchtvs();

      settvs(current);
      setNexttvs(next);
    }

    loadtv();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    const inputValue = event.target.elements[0].value.trim();
    const isCorrect = tvs.release_date === inputValue;

    if (isCorrect) {
      setIsCorrect(true);
      settvScore((prev) => prev + 1);
    } else {
      setIsCorrect(false);
    }

    setTimeout(() => setFlip(true), 250);
    setTimeout(() => {
      setFade(false);
      setFlip(false);
    }, 2500);

    setTimeout(async () => {
      if (!nexttvs) {
        setIsLoadingNext(true);
        return;
      }
      setFade(true);
      setIsCorrect(null);
      settvs(nexttvs);
      setNexttvs(null);
      event.target.reset();
      setIsSubmitting(false);

      const fresh = await fetchtvs();
      setNexttvs(fresh);
    }, 3000);
  }

  useEffect(() => {
    if (isLoadingNext && nexttvs) {
      setIsLoadingNext(false);
      setFade(true);
      setIsCorrect(null);
      settvs(nexttvs);
      setNexttvs(null);
      setIsSubmitting(false);

      fetchtvs().then(setNexttvs);
    }
  }, [nexttvs, isLoadingNext]);

  if (error) return <p>Error: {error}</p>;
  if (!tvs) return <Spinner />;

  return (
    <div className="App">
      <div
        className={"bg-layer " + (fade ? "fade-in" : "fade-out")}
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url(${tvs.poster_path})`,
        }}
      />

      <div className="content">
        <NavBar />
        <Score score={tvScore} />
        <div key={tvs.id}>
          <MediaSection
            media={tvs}
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
