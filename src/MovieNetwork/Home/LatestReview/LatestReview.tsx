import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFollowingReviews } from "./Client";

type Review = {
  _id: string;
  content: string;
  movie_id: string;
  update_time?: string;
  author: { _id: string; username: string; avatar?: string };
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

export default function LatestReview({ limit = 5 }: { limit?: number }) {
  const [items, setItems] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [unauthed, setUnauthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const reviews = await getFollowingReviews(limit);
        if (mounted) {
          setItems(reviews);
          setUnauthed(false);
        }
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

  return (
    <section className="mt-5">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="h5 m-0">Latest Reviews</h3>
      </div>

      {loading && <div className="text-secondary">Loading…</div>}

      {!loading && unauthed && (
        <div className="alert alert-warning py-2">
          Please log in to see your following feed.
        </div>
      )}

      {!loading && !unauthed && err && (
        <div className="alert alert-danger py-2">Error: {err}</div>
      )}

      {!loading && !unauthed && !err && items.length === 0 && (
        <div className="text-muted">No recent reviews from people you follow.</div>
      )}

      {!loading && !unauthed && !err && items.length > 0 && (
        <ul className="list-group">
          {items.map((r) => (
            <li key={r._id} className="list-group-item bg-dark text-light border-secondary">
              <div className="d-flex gap-3 align-items-start">
                <img
                  src={r.author?.avatar || "https://via.placeholder.com/40?text=U"}
                  alt={r.author?.username || "User"}
                  className="rounded-circle flex-shrink-0"
                  width={40}
                  height={40}
                />
                <div className="flex-grow-1">
                  <div className="d-flex flex-wrap gap-2 align-items-center mb-1">
                    <strong>{r.author?.username ?? "Unknown"}</strong>
                    <span className="text-secondary">· {timeAgo(r.update_time)}</span>
                    <span className="text-secondary">·</span>
                    <Link to={`/movie/${r.movie_id}`} className="link-info text-decoration-none">
                      View movie
                    </Link>
                  </div>
                  <p className="mb-0 text-light" style={{ whiteSpace: "pre-wrap" }}>
                    {r.content}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}