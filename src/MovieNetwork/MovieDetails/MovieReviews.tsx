import { useMemo, useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as client from "./client";
import * as userClient from "../Account/client";

type Review = {
  _id?: string;
  user_id?: string;
  movie_id: string;
  content: string;
  createdAt?: string;
};

type User = {
  _id: string;
  username: string;
  avatar?: string;
  bio?: string;
};

type ReviewWithUser = Review & {
  user?: User;
};

export default function MovieReviews({ reviews, movieId }: { reviews: Review[]; movieId: string }) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const navigate = useNavigate();
  const isSignedIn = useMemo(() => !!currentUser, [currentUser]);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [list, setList] = useState<ReviewWithUser[]>(reviews || []);
  const [liked, setLiked] = useState<boolean>(false);
  const [liking, setLiking] = useState<boolean>(false);

  // Get comment user info
  const fetchUserInfo = async (userId: string): Promise<User | null> => {
    try {
      const user = await userClient.findProfile(userId);
      return user;
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      return null;
    }
  };

  // Add user info for all comments
  useEffect(() => {
    const enrichReviewsWithUserInfo = async () => {
      if (!reviews || reviews.length === 0) return;
      
      const enrichedReviews = await Promise.all(
        reviews.map(async (review) => {
          if (review.user_id) {
            const user = await fetchUserInfo(review.user_id);
            return { ...review, user: user || undefined };
          }
          return review;
        })
      );
      
      setList(enrichedReviews);
    };

    enrichReviewsWithUserInfo();
  }, [reviews]);

  const toggleLike = async () => {
    if (!isSignedIn) return;
    try {
      setLiking(true);
      if (liked) {
        await client.unlikeMovie(String(movieId));
        setLiked(false);
      } else {
        await client.likeMovie(String(movieId));
        setLiked(true);
      }
    } finally {
      setLiking(false);
    }
  };

  const navigateToUserProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const submit = async () => {
    if (!isSignedIn || !content.trim()) return;
    try {
      setSubmitting(true);
      const newReview = await client.createReview({
        movie_id: movieId,
        content: content.trim(),
        user_id: currentUser?._id,
      });
      
      // Add user info for new comment
      const newReviewWithUser: ReviewWithUser = {
        ...newReview,
        user: currentUser
      };
      
      setList([newReviewWithUser, ...list]);
      setContent("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <h4 className="mb-3">Reviews</h4>

      {/* Like actions should appear under the Reviews title */}
      {isSignedIn ? (
        <div className="mb-3 d-flex align-items-center gap-2">
          <button
            className={`btn d-inline-flex align-items-center gap-2 ${liked ? "btn-danger" : "btn-outline-danger"}`}
            disabled={liking}
            onClick={toggleLike}
            title="Like/Unlike"
          >
            {liked ? <AiFillHeart /> : <AiOutlineHeart />}
            <span>{liked ? "Liked" : "Like"}</span>
          </button>
        </div>
      ) : (
        <div className="text-muted mb-3">Please login to like and comment</div>
      )}

      {isSignedIn ? (
        <div className="mb-3">
          <textarea
            className="form-control"
            rows={3}
            placeholder="Share your thoughts about this movie..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="mt-2 d-flex justify-content-end">
            <button className="btn btn-primary" disabled={submitting || !content.trim()} onClick={submit}>
              Submit
            </button>
          </div>
        </div>
      ) : null}

      {list?.length ? (
        <ul className="list-group">
          {list.map((r) => (
            <li key={r._id || Math.random().toString(36)} className="list-group-item">
              <div className="d-flex align-items-center mb-2">
                <div className="me-3">
                  <img 
                    src={r.user?.avatar || "/avatar/default.png"} 
                    alt={r.user?.username || "User"} 
                    className="rounded-circle"
                    onClick={() => r.user?._id && navigateToUserProfile(r.user._id)}
                    style={{ width: "32px", height: "32px", objectFit: "cover", cursor: "pointer" }}
                  />
                </div>
                <div className="flex-grow-1">
                  <div 
                    className="fw-bold" 
                    onClick={() => r.user?._id && navigateToUserProfile(r.user._id)}
                    style={{ cursor: "pointer" }}
                  >
                    {r.user?.username || "Unknown User"}
                  </div>
                  <div className="small text-muted">{r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}</div>
                </div>
              </div>
              <div style={{ whiteSpace: "pre-wrap" }}>{r.content}</div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-muted">No reviews yet</div>
      )}
    </section>
  );
}

