import MediaCard from "./MediaCard";
import MediaInfo from "./MediaInfo";

export default function MediaSection({ media, fade, flip, isCorrect, isMovie }) {
  return (
    <div className={`${fade ? "fade-in" : "fade-out"}`}>
      <MediaCard media={media} flip={flip} isCorrect={isCorrect} isMovie={isMovie} />
      <MediaInfo media={media} isMovie={isMovie} />
    </div>
  );
}
