import Search from "./components/search";
import { useState, useEffect } from "react";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

function App() {
  const [searchTerm, setsearchTerm] = useState("");
  const [errorMessage, seterrorMessage] = useState(null);
  const [movieList, setmovieList] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  const fetchMovies = async () => {
    setisLoading(true);
    seterrorMessage(null);
    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();

      if (data.Response === "False") {
        seterrorMessage(data.Error || "Failed to fetch movies");
        setmovieList([]);
        return;
      }
      setmovieList(data.results || []);
      console.log("Movies data:", data);
    } catch (error) {
      console.error("Error fetching movies:", error);
      seterrorMessage("Failed to fetch movies. Please try again later.");
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setsearchTerm={setsearchTerm} />
        </header>

        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.key} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
