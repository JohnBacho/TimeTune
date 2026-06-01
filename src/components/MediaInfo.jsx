import "./MediaInfo.css";
export default function MediaInfo({ media, isMovie }) {
  let formatRating = null;
  isMovie
    ? (formatRating =
        media?.vote_average != null
          ? media.vote_average.toString().trim().slice(0, 3)
          : null)
    : (formatRating = media.artist);
  return (
    <div
      className="movie-info"
      style={
        isMovie
          ? { flexDirection: "row", gap: "20px" }
          : { flexDirection: "column", gap: "0px" }
      }
    >
      <h3>{media?.title}</h3>
      {formatRating && isMovie && <p>⭐ {formatRating}</p>}
      {formatRating && !isMovie && <p>By: {formatRating}</p>}
    </div>
  );
}
