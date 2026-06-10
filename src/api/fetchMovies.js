const API_TOKEN = import.meta.env.VITE_MY_API_KEY;

export async function fetchMovies() {
  const randomPage = Math.floor(Math.random() * 500) + 1;
  const URL = `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${randomPage}&include_adult=false`;

  const response = await fetch(URL, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  const data = await response.json();

  if (data.results && data.results.length > 0) {
    const startIndex = Math.floor(Math.random() * data.results.length);
    for (let i = 0; i < data.results.length; i++) {
      const randomMovie = data.results[(startIndex + i) % data.results.length];

      if (
        randomMovie.adult === true ||
        randomMovie.softcore === true ||
        randomMovie.vote_count < 350
      ) {
        continue;
      }

      return {
        id: randomMovie.id,
        name: randomMovie.title,
        release_date: randomMovie.release_date.trim().slice(0, 4),
        poster_path: "https://image.tmdb.org/t/p/w500" + randomMovie.poster_path,
        rating: randomMovie.vote_average,
      };
    }
    return fetchMovies();
  } else {
    return fetchMovies();
  }
}