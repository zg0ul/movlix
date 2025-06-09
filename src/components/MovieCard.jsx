import React from "react";

function MovieCard({
  movie: { title, vote_average, poster_path, release_date, original_language },
  movie,
  onCardClick,
}) {
  const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500/";
  const DEFAULT_IMAGE = "/no-movie.png";

  const handleClick = () => {
    if (onCardClick) {
      onCardClick(movie);
    }
  };
  console.log("MovieCard rendered:", title, poster_path);

  return (
    <div className="movie-card" onClick={handleClick}>
      <img
        src={poster_path ? `${BASE_IMAGE_URL}${poster_path}` : DEFAULT_IMAGE}
        alt={`${title} movie poster`}
        loading="lazy"
      />
      <h3>{title}</h3>
      <div className="content">
        <div className="rating">
          <img src="/star.svg" alt="Star Icon" />
          <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
        </div>
        <span>•</span>
        <p className="lang">{original_language}</p>
        <span>•</span>
        <p className="year">
          {release_date ? release_date.split("-")[0] : "N/A"}
        </p>
      </div>
    </div>
  );
}

export default MovieCard;
