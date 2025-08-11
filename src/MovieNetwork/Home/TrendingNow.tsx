// src/components/HotNow.tsx  — Bootstrap 版
import { useEffect, useState } from "react";
import { getLatestMovies } from "./Client";

type Movie = {
  id: number;
  title: string;
  poster_path?: string;
  release_date?: string;
  vote_average?: number;
};

const poster185 = (path?: string) =>
  path
    ? `https://image.tmdb.org/t/p/w185${path}`
    : "https://via.placeholder.com/185x278?text=No+Poster";

const isNew = (date?: string) => {
  if (!date) return false;
  const d = new Date(date);
  const now = new Date();
  return (now.getTime() - d.getTime()) / (1000 * 3600 * 24) <= 30;
};

export default function TrendingNow() {
  const [list, setList] = useState<Movie[]>([]);

  useEffect(() => {
    (async () => {
      const results = await getLatestMovies();
      setList(results.slice(0, 10));
    })();
  }, []);

  return (
    <section className="container-fluid px-3 px-md-4">

      <div className="row row-cols-2 row-cols-sm-3 row-cols-lg-5 g-4">
        {list.map((m) => (
          <div className="col" key={m.id}>
            <a href={`/details/${m.id}`} className="text-decoration-none">
              <div className="card bg-dark border-0">
                <div
                  className="position-relative overflow-hidden rounded"
                  style={{ aspectRatio: "185 / 278" }}
                >
                  <img
                    src={poster185(m.poster_path)}
                    alt={m.title}
                    className="w-100 h-100"
                    style={{ objectFit: "cover", display: "block" }}
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://via.placeholder.com/185x278?text=No+Poster";
                    }}
                  />
                  {isNew(m.release_date) && (
                    <span className="position-absolute top-0 start-0 translate-middle-y ms-2 mt-2 badge bg-success text-dark fw-semibold">
                      New
                    </span>
                  )}
                </div>

                <div className="card-body px-0">
                  <div className="d-flex align-items-baseline gap-2">
                    <a
                      href={`/details/${m.id}`}
                      className="text-info small text-truncate flex-grow-1"
                      title={m.title}
                    >
                      {m.title}
                    </a>
                    {typeof m.vote_average === "number" && (
                      <span className="small" style={{ color: "#f2b01e" }}>
                        {m.vote_average.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}