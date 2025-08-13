import { useEffect, useMemo, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import * as client from "./client";
import * as accountClient from "../Account/client";

type Props = {
  movie: { id: string; title: string };
  currentUser: any;
};

export default function MovieActions({ movie, currentUser }: Props) {
  const [liking, setLiking] = useState(false);
  const [liked, setLiked] = useState<boolean>(false);
  const isSignedIn = useMemo(() => !!currentUser, [currentUser]);

  const fetchIsLiked = async () => {
    if (!isSignedIn) return;
    const profile = await accountClient.findProfile(currentUser._id);
    setLiked(profile.liked.includes(String(movie.id)));
  };

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

  useEffect(() => {
    fetchIsLiked();
  }, [currentUser]);

  return (
    <section className="mb-4">

      {!isSignedIn ? (
        <div className="text-muted small mt-2">Login to like, comment and rate.</div>
      ) : (
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
      )}
    </section>
  );
}

