import { useEffect, useState } from "react";
import * as client from "./client";
import { useSelector } from "react-redux";
import { FaRegStar, FaStar } from "react-icons/fa";
import { Button } from "react-bootstrap";
import { BiReset } from "react-icons/bi";

type Genre = {
  id?: number;
  name: string;
};

export type MovieDetailsData = {
  id: number;
  title: string;
  poster_path?: string | null;
  release_date?: string;
  original_language?: string;
  vote_average?: number;
  vote_count?: number;
  overview?: string;
  genres?: Genre[];
  adult?: boolean;
};

function getPosterUrl(posterPath?: string | null, size: string = "w500") {
  if (!posterPath) return "https://via.placeholder.com/500x750?text=No+Image";
  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
}

export default function MovieInfo({ movie }: { movie: MovieDetailsData }) {
  const {
    title,
    poster_path,
    release_date,
    original_language,
    vote_average,
    vote_count,
    overview,
    genres,
    adult,
  } = movie || {};

  const genreText = (genres || []).map((g) => g.name).join(", ");

  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [voted, setVoted] = useState<boolean>(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);

  // Get user's voted movies
  const getMovieVoted = async () => {
    if (!currentUser?._id) return;
    const votedMovies = await client.getUserVotedMovies(currentUser._id);
    setVoted(votedMovies.voted_movie.some((m: any) => m.movie_id === movie.id.toString()));
  };

  // Get user's movie rating
  const getUserMovieRating = async () => {
    if (!currentUser?._id) return;
    const rating = await client.getUserMovieRating(movie.id.toString());
    setUserRating(rating.rating ? rating.rating : 0);
    setRating(rating.rating ? rating.rating : 0);
  };

  // Get movie average rating
  const getMovieAverageRating = async () => {
    const averageRating = await client.getMovieAverageRating(movie.id.toString());
    setAverageRating(averageRating[0].averageRating);
  };

  //movie rating
  const [rating, setRating] = useState(userRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = async (value: number) => {
    if (voted) return;
    setRating(value);
    await client.voteMovie(movie.id.toString(), { rating: value });
    setVoted(true);
    getUserMovieRating();
    getMovieAverageRating();
  };

  const resetVote = async () => {
    if (!voted) return;
    await client.unvoteMovie(movie.id.toString());
    setVoted(false);
    getUserMovieRating();
    setRating(0);
    getMovieAverageRating();
  };

  const handleMouseEnter = (value: number) => {
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const getStarState = (starIndex: number) => {
    const currentRating = rating === 0 ? hoverRating : rating;
    const starValue = starIndex * 2; // every star represents 2 points

    if (currentRating >= starValue) return 'full';
    if (currentRating >= starValue - 1) return 'half';
    return 'empty';
  };

  const renderStar = (starIndex: number) => {
    const starState = getStarState(starIndex);
    const leftValue = (starIndex - 1) * 2 + 1;  // left side score
    const rightValue = starIndex * 2;           // right side score

    return (
      <div
        key={starIndex}
        className="me-1"
        style={{ position: 'relative', display: 'inline-block', cursor: !voted ? 'pointer' : 'default' }}
      >
        {/* blank star */}
        <FaRegStar
          size={24}
          style={{ color: '#e4e5e9' }}
        />

        {/* left click area */}
        <div
          onClick={() => handleClick(leftValue)}
          onMouseEnter={() => handleMouseEnter(leftValue)}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '50%',
            height: '100%',
            zIndex: 3
          }}
        />

        {/* right click area */}
        <div
          onClick={() => handleClick(rightValue)}
          onMouseEnter={() => handleMouseEnter(rightValue)}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            zIndex: 3
          }}
        />

        {/* filled star */}
        {starState === 'full' && (
          <FaStar
            size={24}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#ffc107',
              transition: 'color 0.2s ease'
            }}
          />
        )}

        {starState === 'half' && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            width: '50%',
            height: '100%',
            transform: 'translateY(-50%)',
            overflow: 'hidden'
          }}>
            <FaStar
              size={24}
              style={{
                color: '#ffc107',
                transition: 'color 0.2s ease'
              }}
            />
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    getMovieVoted();
    getUserMovieRating();
    getMovieAverageRating();
  }, [currentUser]);

  return (
    <section
      className="mb-4 position-relative overflow-hidden rounded-3"
      style={{ backgroundColor: "#0b1324" }}
    >
      {/* Background poster with blur and low opacity */}
      <div
        aria-hidden
        className="position-absolute w-100 h-100"
        style={{
          top: 0,
          left: 0,
          backgroundImage: `url(${getPosterUrl(poster_path, "w780")})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(10px)",
          opacity: 0.25,
        }}
      />
      {/* Dark gradient overlay for readability */}
      <div
        aria-hidden
        className="position-absolute w-100 h-100"
        style={{
          top: 0,
          left: 0,
          background:
            "linear-gradient(90deg, rgba(11,19,36,0.92) 0%, rgba(11,19,36,0.75) 45%, rgba(11,19,36,0.55) 100%)",
        }}
      />

      {/* Foreground content */}
      <div className="position-relative p-4 p-md-5">
        <div className="row g-4 align-items-start">
          <div className="col-12 col-md-4 col-lg-3">
            <img
              src={getPosterUrl(poster_path)}
              alt={title}
              className="img-fluid rounded shadow w-100"
            />
          </div>
          <div className="col-12 col-md-8 col-lg-9 text-white">
            <h2 className="mb-2 d-flex align-items-center gap-2">
              <span>{title}</span>
            </h2>

            <div className="text-white-50 mb-3">
              {adult !== undefined ? (
                <span
                  className={`badge rounded-pill ${adult ? "text-bg-danger" : "text-bg-success"} me-3`}
                  style={{ verticalAlign: "baseline" }}
                >
                  {adult ? "18+" : "All Ages"}
                </span>
              ) : null}
              {release_date ? <span className="me-3">Release: {release_date}</span> : null}
              {original_language ? (
                <span className="me-3">Language: {original_language?.toUpperCase()}</span>
              ) : null}
              {typeof vote_average === "number" ? (
                <span className="me-3">Rating: {vote_average?.toFixed(1)}</span>
              ) : null}
              {typeof vote_count === "number" ? (
                <span className="me-3">Votes: {vote_count}</span>
              ) : null}
            </div>

            {genreText ? (
              <div className="mb-3">
                <strong>Genres: </strong>
                <span className="ms-2">{genreText}</span>
              </div>
            ) : null}

            {overview ? (
              <div>
                <strong className="d-block mb-1">Overview</strong>
                <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
                  {overview}
                </p>
              </div>
            ) : (
              <div className="text-white-50">No overview available</div>
            )}

            {!!currentUser ? (
              <div className="mt-3">
                My Rating: {[1, 2, 3, 4, 5].map((starIndex) => renderStar(starIndex))}
                {voted && (
                  <Button variant="danger" onClick={resetVote} className="ms-1">
                    <BiReset className="fs-4" />
                  </Button>
                )}
                <div className="mt-2">
                  <strong>Average Rating: </strong>
                  {averageRating > 0 ? averageRating.toFixed(1) : "N/A"}
                </div>
              </div>
            ) : (
              <div>

              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

