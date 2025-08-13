import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
// import { useSelector } from "react-redux";
import * as client from "./client";
import MovieInfo from "./MovieInfo";
import MovieReviews from "./MovieReviews";

export default function MovieDetails() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Keep selector for future use if needed
  // const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [movie, setMovie] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!movieId) return;
      try {
        const [movieData, reviewsData] = await Promise.all([
          client.getMovieDetails(movieId),
          client.getMovieReviews(movieId),
        ]);
        setMovie(movieData);
        setReviews(reviewsData);
      } catch (error) {
        console.error("Failed to fetch movie data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId]);

  const handleBack = () => {
    const returnTo = searchParams.get('returnTo');
    console.log("ReturnTo parameter:", returnTo);
    console.log("Current location:", window.location.href);

    if (returnTo) {
      try {
        // Decode the URL first
        const decodedReturnTo = decodeURIComponent(returnTo);
        console.log("Decoded returnTo:", decodedReturnTo);

        // For hash routing, we need to handle the hash part specially
        if (decodedReturnTo.includes('#')) {
          // Extract everything after the hash
          const hashPart = decodedReturnTo.split('#')[1];
          console.log("Hash part:", hashPart);

          // Navigate to the hash route
          console.log("Navigating to hash route:", hashPart);
          navigate(hashPart);
        } else {
          // Extract the path and search params from the full URL
          const url = new URL(decodedReturnTo, window.location.origin);
          const pathWithSearch = url.pathname + url.search;
          console.log("Parsed path with search:", pathWithSearch);

          // Navigate to the parsed path
          navigate(pathWithSearch);
        }
      } catch (error) {
        // If URL parsing fails, try to navigate directly
        console.error("Error parsing returnTo URL:", error);
        navigate('/');
      }
    } else {
      console.log("No returnTo parameter, navigating to home");
      navigate('/');
    }
  };

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  if (!movie) {
    return <div className="text-center p-5">Movie not found</div>;
  }

  return (
    <div className="container py-5">
      {/* Back Button */}
      {searchParams.get('returnTo') && <div className="mb-4">
        <button
          onClick={handleBack}
          className="btn btn-outline-secondary"
        >
          ← Back to Search Results
        </button>
      </div>}

      <MovieInfo movie={movie} />
      <MovieReviews reviews={reviews} movieId={movieId!} />
    </div>
  );
}