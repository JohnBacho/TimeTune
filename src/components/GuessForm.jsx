import "./GuessForm.css";

export default function GuessForm({
  onSubmit,
  color,
  isSubmitting,
}) {
  return (
    <div className="movie-input">
      <form onSubmit={onSubmit}>
        <input
          style={{ border: `2px solid ${color}` }}
          type="tel"
          placeholder="Release year..."
          required
          autoFocus
          disabled={isSubmitting}
          maxLength="4"
        />

        <button
          style={{ border: `2px solid ${color}` }}
          disabled={isSubmitting}
        >
          Submit
        </button>
      </form>
    </div>
  );
}