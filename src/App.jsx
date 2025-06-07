import Search from "./components/Search";
import Filter from "./components/Filter";
import Pagination from "./components/Pagination";
import { useState, useEffect, useCallback } from "react";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import MovieModal from "./components/MovieModal";
import MovieListSkeleton from "./components/MovieListSkeleton";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite";

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
  const [trendingMovies, settrendingMovies] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [debouncedSearchTerm, setdebouncedSearchTerm] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Filter state
  const [filters, setFilters] = useState({
    genre: "",
    year: "",
    sortBy: "popularity.desc",
    minRating: "",
  });

  // Debounce the search term to prevent making too many API requests
  // by waiting for the user to stop typing for 500ms
  useDebounce(() => setdebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  // Reset to page 1 when search term or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, filters]);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to the movies section when page changes
    const moviesSection = document.querySelector(".all-movies");
    if (moviesSection) {
      moviesSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const fetchMovies = useCallback(
    async (query = "", page = 1) => {
      setisLoading(true);
      seterrorMessage(null);
      try {
        let endpoint;
        const params = new URLSearchParams({
          page: page.toString(),
        });

        if (query) {
          // Search movies
          endpoint = `${API_BASE_URL}/search/movie`;
          params.append("query", query);
        } else {
          // Discover movies with filters
          endpoint = `${API_BASE_URL}/discover/movie`;
          params.append("sort_by", filters.sortBy);

          if (filters.genre) {
            params.append("with_genres", filters.genre);
          }

          if (filters.year) {
            params.append("primary_release_year", filters.year);
          }

          if (filters.minRating) {
            params.append("vote_average.gte", filters.minRating);
          }
        }

        const response = await fetch(`${endpoint}?${params}`, API_OPTIONS);

        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }

        const data = await response.json();

        if (data.Response === "False") {
          seterrorMessage(data.Error || "Failed to fetch movies");
          setmovieList([]);
          setTotalPages(1);
          setTotalResults(0);
          return;
        }

        setmovieList(data.results || []);
        setTotalPages(Math.min(data.total_pages || 1, 500)); // TMDB limits to 500 pages
        setTotalResults(data.total_results || 0);

        if (query && data.results.length > 0) {
          // Update the search count in Appwrite database
          await updateSearchCount(query, data.results[0]);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
        seterrorMessage("Failed to fetch movies. Please try again later.");
        setTotalPages(1);
        setTotalResults(0);
      } finally {
        setisLoading(false);
      }
    },
    [filters],
  );

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      settrendingMovies(movies);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm, currentPage);
  }, [debouncedSearchTerm, currentPage, fetchMovies]);

  useEffect(() => {
    loadTrendingMovies();
  }, []); // Fetch trending movies on initial load

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

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <div className="movies-header">
            <h2>All Movies</h2>
            {totalResults > 0 && (
              <p className="results-count">
                Showing {(currentPage - 1) * 20 + 1}-
                {Math.min(currentPage * 20, totalResults)} of{" "}
                {totalResults.toLocaleString()} results
              </p>
            )}
          </div>

          <Filter filters={filters} setFilters={setFilters} />

          {isLoading ? (
            <MovieListSkeleton count={8} />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : movieList.length === 0 ? (
            <div className="no-movies">
              <img src="/no-movie.png" alt="No movies found" />
              <h3>No movies found</h3>
              <p>
                Try adjusting your search or filters to find what you're looking
                for.
              </p>
            </div>
          ) : (
            <>
              <ul>
                {movieList.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onCardClick={handleMovieClick}
                  />
                ))}
              </ul>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isLoading={isLoading}
              />
            </>
          )}
        </section>
      </div>

      <MovieModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </main>
  );
}

export default App;
