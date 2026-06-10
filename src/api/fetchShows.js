let cachedToken = null;

export async function getToken() {
  if (cachedToken) return cachedToken;
  const res = await fetch("https://api4.thetvdb.com/v4/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apikey: import.meta.env.VITE_MY_API_KEY_TV }),
  });
  const {
    data: { token },
  } = await res.json();
  cachedToken = token;
  return token;
}

export async function fetchShows() {
  const randomPage = Math.floor(Math.random() * 65) + 1;
  const token = await getToken();
  const URL = `https://api4.thetvdb.com/v4/series/filter?country=usa&lang=eng&sort=score&sortType=desc&page=${randomPage}`;

  const res = await fetch(URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Accept-Language": "eng",
    },
  });

  const data = await res.json();

  if (data.data && data.data.length > 0) {
    const startIndex = Math.floor(Math.random() * data.data.length);
    for (let i = 0; i < data.data.length; i++) {
      const randomShow = data.data[(startIndex + i) % data.data.length];

      if (
        randomShow.image === null ||
        randomShow.year?.length !== 4 ||
        randomShow.year === "" ||
        randomShow.score < 350 ||
        randomShow.name === "WWE Superstar Ink"
      ) {
        continue;
      }

      return {
        id: randomShow.id,
        name: randomShow.name.replace(/\s*\([^)]*\)/g, ""),
        release_date: randomShow.year,
        poster_path: randomShow.image,
        rating: randomShow.score,
      };
    }
    return fetchShows();
  } else {
    return fetchShows();
  }
}