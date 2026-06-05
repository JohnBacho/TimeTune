import "./MediaInfo.css";
export default function MediaInfo({ media, isMovie }) {
  let formatRating = null;
  isMovie
    ? (formatRating =
        media.rating < 1000
          ? media.rating.toString().trim().slice(0, 3)
          : (media.rating / 1000)
              .toString()
              .trim()
              .slice(0, 3)
              .replace(".", "") + "k")
    : (formatRating = media.artist);
  return (
    <div
      className="movie-info"
      style={
        isMovie
          ? { flexDirection: "row", columnGap: "20px" }
          : { flexDirection: "column", gap: "0px" }
      }
    >
      <h3>{media?.name}</h3>
      {formatRating && isMovie && <p>⭐ {formatRating}</p>}
      {formatRating && !isMovie && <p>By: {formatRating}</p>}
    </div>
  );
}
