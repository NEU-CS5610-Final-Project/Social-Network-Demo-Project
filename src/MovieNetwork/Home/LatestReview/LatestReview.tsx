// src/Home/LatestReview.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFollowingReviews } from "./Client";
import { getMovieDetails } from "../../MovieDetails/client";

type Review = {
  _id: string;
  content: string;
  movie_id: string;
  update_time?: string;
  author: { _id: string; username: string; avatar?: string };
  movie?: { title: string; id: string };
};

function timeAgo(iso?: string) {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d ago`;
}

const isWithinDays = (iso?: string, days = 30) => {
  if (!iso) return false;
  const ms = Date.now() - new Date(iso).getTime();
  return ms <= days * 24 * 60 * 60 * 1000;
};

export default function LatestReview({ limit = 5 }: { limit?: number }) {
  const [all, setAll] = useState<Review[]>([]);
  const [recent, setRecent] = useState<Review[]>([]);
  const [hiddenCount, setHiddenCount] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [unauthed, setUnauthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // 多取一些，避免"View all"时再次请求
        const list = await getFollowingReviews(200);
        if (!mounted) return;

        // 获取每个评论对应的电影信息
        const reviewsWithMovies = await Promise.all(
          list.map(async (review: Review) => {
            try {
              const movieDetails = await getMovieDetails(review.movie_id);
              return {
                ...review,
                movie: {
                  title: movieDetails.title,
                  id: review.movie_id
                }
              };
            } catch (error) {
              console.error(`Failed to fetch movie details for ${review.movie_id}:`, error);
              return {
                ...review,
                movie: {
                  title: "Unknown Movie",
                  id: review.movie_id
                }
              };
            }
          })
        );

        const in30 = reviewsWithMovies.filter((r: Review) => isWithinDays(r.update_time, 30));
        const recentLimited = in30.slice(0, limit);
        const olderCount = reviewsWithMovies.length - in30.length;

        setAll(reviewsWithMovies);
        setRecent(recentLimited);
        setHiddenCount(Math.max(olderCount, 0));
        setUnauthed(false);
        setErr(null);
      } catch (e: any) {
        const msg = String(e?.message || "");
        if (mounted) {
          if (msg.includes("401")) setUnauthed(true);
          setErr(msg);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [limit]);

  const listToShow = showAll ? all : recent;

  return (
    <section className="mt-5">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="h5 m-0">Latest Reviews</h3>
        {!loading && !unauthed && !err && (
          <button
            type="button"
            className="btn btn-link p-0 text-decoration-none small"
            onClick={() => setShowAll(v => !v)}
          >
            {showAll
              ? "Collapse"
              : `View all${hiddenCount > 0 ? ` (${hiddenCount} older)` : ""} »`}
          </button>
        )}
      </div>

      {/* States */}
      {loading && <div className="text-secondary">Loading…</div>}

      {!loading && unauthed && (
        <div className="alert alert-warning py-2 mb-0">
          Please log in to see your following feed.
        </div>
      )}

      {!loading && !unauthed && err && (
        <div className="alert alert-danger py-2 mb-0">Error: {err}</div>
      )}

      {!loading && !unauthed && !err && listToShow.length === 0 && (
        <div className="text-muted">No recent reviews from people you follow.</div>
      )}

      {/* List */}
      {!loading && !unauthed && !err && listToShow.length > 0 && (
        <div className="vstack gap-3">
          {listToShow.map((r) => (
            <div
              key={r._id}
              className="card bg-dark text-light border-secondary shadow-sm review-card"
            >
              <div className="card-body py-3">
                <div className="d-flex gap-3">
                  {/* Avatar */}
                  <img
                    src={`/avatar/${r.author?.avatar || 'default'}.png`}
                    alt={r.author?.username || "User"}
                    className="rounded-circle flex-shrink-0 border border-1 border-light"
                    width={56}
                    height={56}
                    style={{ backgroundColor: "white" }}
                  />

                  {/* Right side */}
                  <div className="flex-grow-1">
                    {/* Top line: username + time + movie name */}
                    <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                      <strong className="me-1">{r.author?.username ?? "Unknown User"}</strong>
                      <span className="badge bg-secondary-subtle text-secondary-emphasis">
                        {timeAgo(r.update_time)}
                      </span>
                      <span className="text-muted">•</span>
                      <Link
                        to={`/movie/${r.movie_id}`}
                        className="text-decoration-none fw-medium border border-secondary rounded px-2 py-0.8"
                        style={{ fontSize: "0.9rem", color: "white" }}
                      >
                        {r.movie?.title || "Unknown Movie"}
                      </Link>
                    </div>

                    {/* Content */}
                    <p className="mb-0 lh-base" style={{ whiteSpace: "pre-wrap" }}>
                      {r.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}