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
          </div>
        </div>
      </div>
    </section>
  );
}

