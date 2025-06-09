import { Helmet } from "react-helmet-async";

function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  movie = null,
}) {
  const defaultTitle = "MovieFlex - Discover Your Next Favorite Movie";
  const defaultDescription =
    "Discover trending movies with advanced filtering, real-time search, and personalized recommendations. Built with React and powered by TMDB API.";
  const defaultImage = "/Movlix.png"; // Using the specified thumbnail
  const siteUrl = "https://movieflex.app"; // Replace with your actual URL when deployed

  const seoTitle = title ? `${title} | MovieFlex` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoImage = image || defaultImage;
  const seoUrl = url || siteUrl;

  // Generate structured data for movies
  const structuredData = movie
    ? {
        "@context": "https://schema.org",
        "@type": "Movie",
        name: movie.title,
        description: movie.overview,
        image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        datePublished: movie.release_date,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: movie.vote_average,
          ratingCount: movie.vote_count,
        },
        genre: movie.genres?.map((g) => g.name) || [],
      }
    : null;

  // Generate website structured data
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MovieFlex",
    url: siteUrl,
    description: defaultDescription,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta
        name="keywords"
        content={
          keywords ||
          "movies, film, cinema, trending, discover, react, tmdb, movie database, entertainment"
        }
      />

      {/* Open Graph */}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="MovieFlex" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />

      {/* Additional Meta */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="MovieFlex" />
      <link rel="canonical" href={seoUrl} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {/* Website Structured Data */}
      {!movie && (
        <script type="application/ld+json">
          {JSON.stringify(websiteStructuredData)}
        </script>
      )}
    </Helmet>
  );
}

export default SEO;
