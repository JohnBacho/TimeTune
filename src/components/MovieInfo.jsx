import "./MovieInfo.css";
export default function MovieInfo(props) {
  const { movies } = props;
  const formatRating = movies.vote_average.toString().trim().slice(0, 3);
  return (
    <div className="movie-info">
      <h3>{movies.title}</h3>
      <p>⭐ {formatRating}</p>
    </div>
  );
}
