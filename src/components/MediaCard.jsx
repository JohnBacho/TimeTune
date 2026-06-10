import "./MediaCard.css";
import confetti from "canvas-confetti";
import { useEffect, useRef, useState } from "react";

export default function MediaCard({ media, flip, isCorrect, isMovie }) {
  const hasFired = useRef(false);

  useEffect(() => {
    if (isCorrect && !hasFired.current) {
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { x: 0.5, y: 0.5 },
        });
      }, 350);

      hasFired.current = true;
    }

    if (!isCorrect) {
      hasFired.current = false;
    }
  }, [isCorrect]);

  return (
    <div className="movie-poster-container">
      <div
        className={`flip-card ${flip ? "flip-in" : ""}`}
        style={{
          ...(isMovie
            ? { aspectRatio: "2 / 3", height: "120vw", maxHeight: "58vh" }
            : { aspectRatio: "1 / 1", width: "90vw", maxWidth: "450px" }),
          transform: flip ? "" : "rotateY(0deg)",
        }}
      >
        <div className="flip-card-front">
          <img
            className="movie-poster"
            src={media.poster_path}
            alt={media.name}
          />
        </div>

        <div className="flip-card-back">
          <h3>{media.release_date}</h3>
        </div>
      </div>
    </div>
  );
}
