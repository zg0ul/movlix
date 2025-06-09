import React, { useEffect, useState } from "react";
import SkeletonLoader from "./SkeletonLoader";
import SEO from "./SEO";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

function MovieModal({ movie, isOpen, onClose }) {
  const [movieDetails, setMovieDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500/";
  const BACKDROP_IMAGE_URL = "https://image.tmdb.org/t/p/original/";

  useEffect(() => {
    if (isOpen && movie?.id) {
      fetchMovieDetails(movie.id);
    }
  }, [isOpen, movie?.id]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Disable background scroll
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      // Re-enable background scroll when modal is closed
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      // Cleanup: always restore scroll when component unmounts
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const fetchMovieDetails = async (movieId) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/movie/${movieId}?append_to_response=credits`,
        API_OPTIONS,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch movie details");
      }

      const data = await response.json();
      setMovieDetails(data);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (!isOpen) return null;

  return (
    <>
      {movie && (
        <SEO
          title={movie.title}
          description={movie.overview}
          image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          keywords={`${movie.title}, movie, ${
            movie.release_date?.split("-")[0]
          }, rating ${movie.vote_average}`}
          type="video.movie"
          movie={movie}
        />
      )}

      <div className="modal-overlay custom-scrollbar" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>

          {isLoading ? (
            <SkeletonLoader />
          ) : movieDetails ? (
            <div className="modal-body">
              {/* Header with backdrop */}
              <div className="modal-header">
                {movieDetails.backdrop_path && (
                  <img
                    src={`${BACKDROP_IMAGE_URL}${movieDetails.backdrop_path}`}
                    alt={`${movieDetails.title} backdrop`}
                    className="modal-backdrop"
                    loading="lazy"
                  />
                )}
                <div className="modal-header-content">
                  <div className="modal-poster">
                    <img
                      src={
                        movieDetails.poster_path
                          ? `${BASE_IMAGE_URL}${movieDetails.poster_path}`
                          : "/no-movie.png"
                      }
                      alt={`${movieDetails.title} movie poster`}
                      loading="lazy"
                    />
                  </div>
                  <div className="modal-info">
                    <h1>{movieDetails.title}</h1>
                    <div className="modal-meta">
                      <span className="year">
                        {movieDetails.release_date?.split("-")[0]}
                      </span>
                      <span className="rating">PG-13</span>
                      <span className="runtime">
                        {formatRuntime(movieDetails.runtime)}
                      </span>
                    </div>
                    <div className="modal-rating">
                      <img src="/star.svg" alt="Star" />
                      <span>{movieDetails.vote_average?.toFixed(1)}</span>
                      <span className="vote-count">
                        ({movieDetails.vote_count?.toLocaleString()})
                      </span>
                    </div>
                    {movieDetails.tagline && (
                      <p className="tagline">{movieDetails.tagline}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="modal-details">
                <div className="modal-section">
                  <h3>Genres</h3>
                  <div className="genres">
                    {movieDetails.genres?.map((genre) => (
                      <span key={genre.id} className="genre-tag">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="modal-section">
                  <h3>Overview</h3>
                  <p>{movieDetails.overview || "No overview available."}</p>
                </div>

                <div className="modal-grid">
                  <div className="modal-section">
                    <h3>Release date</h3>
                    <p>
                      {new Date(movieDetails.release_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>

                  <div className="modal-section">
                    <h3>Countries</h3>
                    <p>
                      {movieDetails.production_countries
                        ?.map((country) => country.name)
                        .join(", ") || "N/A"}
                    </p>
                  </div>

                  <div className="modal-section">
                    <h3>Status</h3>
                    <p>{movieDetails.status}</p>
                  </div>

                  <div className="modal-section">
                    <h3>Language</h3>
                    <p>
                      {movieDetails.spoken_languages
                        ?.map((lang) => lang.english_name)
                        .join(", ") || "N/A"}
                    </p>
                  </div>

                  <div className="modal-section">
                    <h3>Budget</h3>
                    <p>
                      {movieDetails.budget
                        ? formatCurrency(movieDetails.budget)
                        : "N/A"}
                    </p>
                  </div>

                  <div className="modal-section">
                    <h3>Revenue</h3>
                    <p>
                      {movieDetails.revenue
                        ? formatCurrency(movieDetails.revenue)
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="modal-section">
                  <h3>Production Companies</h3>
                  <div className="production-companies">
                    {movieDetails.production_companies?.length > 0
                      ? movieDetails.production_companies
                          .map((company) => company.name)
                          .join(" • ")
                      : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="modal-error">
              <p>Failed to load movie details</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MovieModal;
