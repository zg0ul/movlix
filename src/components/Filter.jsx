import React from "react";

function Filter({ filters, setFilters }) {
  const genres = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const sortOptions = [
    { value: "popularity.desc", label: "Most Popular" },
    { value: "popularity.asc", label: "Least Popular" },
    { value: "release_date.desc", label: "Newest First" },
    { value: "release_date.asc", label: "Oldest First" },
    { value: "vote_average.desc", label: "Highest Rated" },
    { value: "vote_average.asc", label: "Lowest Rated" },
    { value: "original_title.asc", label: "A-Z" },
    { value: "original_title.desc", label: "Z-A" },
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      genre: "",
      year: "",
      sortBy: "popularity.desc",
      minRating: "",
    });
  };

  return (
    <div className="filter-section">
      <div className="filter-header">
        <h3>Filter Movies</h3>
        <button onClick={clearFilters} className="clear-filters-btn">
          Clear All
        </button>
      </div>

      <div className="filter-grid">
        <div className="filter-group">
          <label htmlFor="genre-select">Genre</label>
          <select
            id="genre-select"
            value={filters.genre}
            onChange={(e) => handleFilterChange("genre", e.target.value)}
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="year-select">Release Year</label>
          <select
            id="year-select"
            value={filters.year}
            onChange={(e) => handleFilterChange("year", e.target.value)}
          >
            <option value="">Any Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-select">Sort By</label>
          <select
            id="sort-select"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="rating-input">Min Rating</label>
          <input
            id="rating-input"
            type="number"
            min="0"
            max="10"
            step="0.1"
            placeholder="0.0"
            value={filters.minRating}
            onChange={(e) => handleFilterChange("minRating", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default Filter;
