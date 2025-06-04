import React from "react";

function MovieListSkeleton({ count = 8 }) {
  return (
    <ul className="movie-list-skeleton">
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className="movie-card-skeleton">
          <div className="skeleton-poster"></div>
          <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-meta">
              <div className="skeleton-rating"></div>
              <div className="skeleton-year"></div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default MovieListSkeleton;
