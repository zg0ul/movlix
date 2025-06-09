import React from "react";

function Search({ searchTerm, setsearchTerm }) {
  return (
    <div className="search">
      <div>
        <img src="./search.svg" alt="Search Icon" className="text-[#B6FDD1]" />
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchTerm}
          onChange={(e) => setsearchTerm(e.target.value)}
          aria-label="Search for movies"
          role="searchbox"
        />
      </div>
    </div>
  );
}

export default Search;
