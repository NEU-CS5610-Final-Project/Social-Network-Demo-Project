import { useMemo, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import * as client from "./client";

type Props = {
  movie: { id: number; title: string };
  currentUser: any;
};

export default function MovieActions({ movie, currentUser }: Props) {
  const [liking, setLiking] = useState(false);
  const [liked, setLiked] = useState<boolean>(false);
  const isSignedIn = useMemo(() => !!currentUser, [currentUser]);

  const toggleLike = async () => {
    if (!isSignedIn) return;
    try {
      setLiking(true);
      if (liked) {
        await client.unlikeMovie(String(movie.id));
        setLiked(false);
      } else {
        await client.likeMovie(String(movie.id));
        setLiked(true);
      }
    } finally {
      setLiking(false);
    }
  };

  return (
    <section className="mb-4">
      <div className="d-flex align-items-center gap-2">
        <button
          className={`btn d-inline-flex align-items-center gap-2 ${liked ? "btn-danger" : "btn-outline-danger"}`}
          disabled={!isSignedIn || liking}
          onClick={toggleLike}
          title={isSignedIn ? "Like/Unlike" : "Login to like"}
        >
          {liked ? <AiFillHeart /> : <AiOutlineHeart />}
          <span>{liked ? "Liked" : "Like"}</span>
        </button>

        {/* Extensible: Rating, Watchlist, etc. */}
      </div>
      {!isSignedIn ? (
        <div className="text-muted small mt-2">Login to like, comment and rate</div>
      ) : null}
    </section>
  );
}

