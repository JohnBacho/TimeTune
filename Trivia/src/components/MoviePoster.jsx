import "./MoviePoster.css";
export default function MoviePoster({ movies, flip }) {
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
