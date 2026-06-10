const API_KEY = import.meta.env.VITE_AUDIODB_API_KEY || "2";

function calculatePopularityScore(album) {
  let score = 0;

  score += Number(album.intScore || 0) * 2;
  score += Number(album.intScoreVotes || 0) * 5;

  if (album.strWikipediaID) score += 20;
  if (album.strDiscogsID) score += 10;
  if (album.strDescription) score += 10;
  if (album.strReview) score += 10;
  if (album.strArtist) score += 15;

  return score;
}

export async function fetchMusic() {
  const randomArtistId = Math.floor(Math.random() * 1500) + 111200;
  const URL = `https://www.theaudiodb.com/api/v1/json/${API_KEY}/album.php?i=${randomArtistId}`;

  const response = await fetch(URL);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.album && data.album.length > 0) {
    const startIndex = Math.floor(Math.random() * data.album.length);
    for (let i = 0; i < data.album.length; i++) {
      const randomAlbum = data.album[(startIndex + i) % data.album.length];

      if (
        calculatePopularityScore(randomAlbum) < 50 ||
        randomAlbum.intYearReleased.length !== 4 ||
        !randomAlbum.strAlbumThumb
      ) {
        continue;
      }

      return {
        id: randomAlbum.idAlbum,
        name: randomAlbum.strAlbum,
        title: randomAlbum.strAlbum,
        artist: randomAlbum.strArtist,
        release_date: String(randomAlbum.intYearReleased),
        poster_path: randomAlbum.strAlbumThumb || "",
        ...randomAlbum,
      };
    }
    return fetchMusic();
  } else {
    return fetchMusic();
  }
}