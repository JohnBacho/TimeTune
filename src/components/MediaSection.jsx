import MediaCard from "./MediaCard";
import MediaInfo from "./MediaInfo";

export default function MediaSection({ media, fade, flip, isCorrect }) {
  return (
    <div className={`${fade ? "fade-in" : "fade-out"}`}>
      <MediaCard media={media} flip={flip} isCorrect={isCorrect} />
      <MediaInfo media={media} />
    </div>
  );
}
