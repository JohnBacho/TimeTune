import "./MoviePoster.css";
import confetti from "canvas-confetti";
import { useEffect, useRef } from "react";

export default function MoviePoster({ movies, flip, isCorrect }) {
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
      <div className={`flip-card ${flip ? "flip-in" : "flip-out"}`}>
        <div className="flip-card-front">
          <img
            className="movie-poster"
            src={`https://image.tmdb.org/t/p/w500${movies.poster_path}`}
            alt={movies.title}
          />
        </div>

        <div className="flip-card-back">
          <h3>{movies.release_date.trim().slice(0, 4)}</h3>
        </div>
      </div>
    </div>
  );
}
