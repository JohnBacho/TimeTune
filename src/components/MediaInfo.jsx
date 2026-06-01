import "./MediaInfo.css";
export default function MediaInfo({ media }) {
  const formatRating = media.vote_average.toString().trim().slice(0, 3);
  return (
    <div className="movie-info">
      <h3>{media.title}</h3>
      <p>⭐ {formatRating}</p>
    </div>
  );
}
