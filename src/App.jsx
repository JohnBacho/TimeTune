import "./App.css";
import { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Movie = lazy(() => import("./pages/Movie.jsx"));
const Music = lazy(() => import("./pages/Music.jsx"));
const Show = lazy(() => import("./pages/Shows.jsx"));

function PageLoader({ onTimeout }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onTimeout();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onTimeout]);

  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={styles.wrapper}>
        <div style={styles.spinner} />
      </div>
    </>
  );
}

function SuspenseWithTimeout({ children }) {
  const [timedOut, setTimedOut] = useState(false);

  if (timedOut) {
    return children;
  }

  return (
    <Suspense fallback={<PageLoader onTimeout={() => setTimedOut(true)} />}>
      {children}
    </Suspense>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--Background, #fff)",
    zIndex: 9999,
  },
  spinner: {
    width: 36,
    height: 36,
    border: "3px solid rgba(0,0,0,0.1)",
    borderTop: "3px solid rgba(0,0,0,0.8)",
    borderRadius: "50%",
    animation: "spin 0.75s linear infinite",
  },
};

export default function App() {
  const [movieScore, setMovieScore] = useState(0);
  const [musicScore, setMusicScore] = useState(0);
  const [ShowScore, setTvScore] = useState(0);

  const [Shows, setShows] = useState(null);
  const [nextShows, setNextShows] = useState(null);

  const [movies, setMovies] = useState(null);
  const [nextMovies, setNextMovies] = useState(null);

  const [media, setMedia] = useState(null);
  const [nextMedia, setNextMedia] = useState(null);

  const [music, setMusic] = useState(null);
  const [nextMusic, setNextMusic] = useState(null);

  return (
    <Router>
      <SuspenseWithTimeout>
        <Routes>
          <Route
            path="/"
            element={
              <Movie
                movieScore={movieScore}
                setMovieScore={setMovieScore}
                movies={movies}
                setMovies={setMovies}
                nextMovies={nextMovies}
                setNextMovies={setNextMovies}
              />
            }
          />
          <Route
            path="/music"
            element={
              <Music
                musicScore={musicScore}
                setMusicScore={setMusicScore}
                music={music}
                setMusic={setMusic}
                nextMusic={nextMusic}
                setNextMusic={setNextMusic}
              />
            }
          />
          <Route
            path="/Shows"
            element={
              <Show
                ShowScore={ShowScore}
                setShowScore={setTvScore}
                setShows={setShows}
                Shows={Shows}
                nextShows={nextShows}
                setNextShows={setNextShows}
              />
            }
          />
        </Routes>
      </SuspenseWithTimeout>
    </Router>
  );
}
