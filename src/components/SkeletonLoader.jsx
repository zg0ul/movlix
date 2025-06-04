import React from "react";

function SkeletonLoader() {
  return (
    <div className="skeleton-modal">
      {/* Header skeleton */}
      <div className="skeleton-header">
        <div className="skeleton-backdrop"></div>
        <div className="skeleton-header-content">
          <div className="skeleton-poster"></div>
          <div className="skeleton-info">
            <div className="skeleton-title"></div>
            <div className="skeleton-meta">
              <div className="skeleton-meta-item"></div>
              <div className="skeleton-meta-item"></div>
              <div className="skeleton-meta-item"></div>
            </div>
            <div className="skeleton-rating">
              <div className="skeleton-star"></div>
              <div className="skeleton-rating-text"></div>
            </div>
            <div className="skeleton-tagline"></div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="skeleton-content">
        {/* Genres */}
        <div className="skeleton-section">
          <div className="skeleton-section-title"></div>
          <div className="skeleton-genres">
            <div className="skeleton-genre"></div>
            <div className="skeleton-genre"></div>
            <div className="skeleton-genre"></div>
          </div>
        </div>

        {/* Overview */}
        <div className="skeleton-section">
          <div className="skeleton-section-title"></div>
          <div className="skeleton-overview">
            <div className="skeleton-text-line"></div>
            <div className="skeleton-text-line"></div>
            <div className="skeleton-text-line"></div>
            <div className="skeleton-text-line short"></div>
          </div>
        </div>

        {/* Grid sections */}
        <div className="skeleton-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="skeleton-section">
              <div className="skeleton-section-title small"></div>
              <div className="skeleton-text-line short"></div>
            </div>
          ))}
        </div>

        {/* Production companies */}
        <div className="skeleton-section">
          <div className="skeleton-section-title"></div>
          <div className="skeleton-text-line medium"></div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonLoader;
