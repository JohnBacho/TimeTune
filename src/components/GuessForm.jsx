import "./GuessForm.css";

export default function GuessForm({ onSubmit, color, isSubmitting }) {
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
          onKeyDown={(e) => {
            if (
              !/^\d$/.test(e.key) &&
              ![
                "Backspace",
                "Delete",
                "ArrowLeft",
                "ArrowRight",
                "Tab",
                "Enter"
              ].includes(e.key)
            ) {
              e.preventDefault();
            }
          }}
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
