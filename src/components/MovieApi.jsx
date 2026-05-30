import React, { useState, useEffect } from "react";
import MoviePoster from "./MoviePoster";
import MovieInfo from "./MovieInfo";
import MovieInput from "./MovieInput";

export default function MovieList(props) {
  const { movies } = props;
  return (
    <div>
      <div key={movies.id} className="movie-card">
        <MoviePoster movies={movies} />
        <MovieInfo movies={movies} />
        <MovieInput movies={movies} />
      </div>
    </div>
  );
}
