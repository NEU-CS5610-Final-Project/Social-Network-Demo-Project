import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as client from "./client";
import * as userClient from "../Account/client";
import MovieActions from "./MovieActions";
import { BiLike, BiSolidLike } from "react-icons/bi";

type Review = {
  _id: string;
  user_id?: string;
  movie_id: string;
  content: string;
  voteCount?: number;
  update_time: Date | string;
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
  const isSignedIn = !!currentUser;
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [list, setList] = useState<ReviewWithUser[]>(reviews || []);
  const [votedReviews, setVotedReviews] = useState<any>([]);

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

  // Get user's voted reviews
  const fetchVotedReviews = async () => {
    if (!currentUser?._id) return;
    const voted = await client.getUserVotedReviews(currentUser._id);
    setVotedReviews(voted.votedReviews);
  };

  // Add user info and vote count for all comments
  const enrichReviewsWithUserInfo = async () => {
    if (!reviews || reviews.length === 0) return;

    const enrichedReviews = await Promise.all(
      reviews.map(async (review) => {
        if (review.user_id) {
          const user = await fetchUserInfo(review.user_id);
          const voteCount = await client.getReviewVoteCount(review._id);
          return { ...review, user: user || undefined, voteCount: voteCount.count || 0 };
        }
        return review;
      })
    );

    setList(enrichedReviews);
  };

  const voteReview = async (reviewId: string) => {
    if (!currentUser?._id) return;
    try {
      await client.voteReview(reviewId);
      fetchVotedReviews();
      setList((prevList) =>
        prevList.map((r) =>
          r._id === reviewId ? { ...r, voteCount: (r.voteCount || 0) + 1 } : r
        )
      );
    } catch (error) {
      console.error("Failed to vote review:", error);
    }
  };

  const unvoteReview = async (reviewId: string) => {
    if (!currentUser?._id) return;
    try {
      await client.unvoteReview(reviewId);
      fetchVotedReviews();
      setList((prevList) =>
        prevList.map((r) =>
          r._id === reviewId ? { ...r, voteCount: (r.voteCount || 0) - 1 } : r
        )
      );
    } catch (error) {
      console.error("Failed to unvote review:", error);
    }
  };

  const formatReviewDate = (reviewDate: string | Date) => {
    if (!reviewDate) return 'Recent';

    const date = new Date(reviewDate);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();

    // convert to minutes and hours
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      // on or before yesterday
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  useEffect(() => {
    enrichReviewsWithUserInfo();
    fetchVotedReviews();
  }, [reviews]);

  const navigateToUserProfile = (userId: string) => {
    navigate(`/Account/profile/${userId}`);
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
      <MovieActions movie={{ id: movieId, title: "" }} currentUser={currentUser} />
      <h4 className="mb-3">Reviews</h4>

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
          {list.map((r) => {
            const isVoted = votedReviews?.some((vote: any) => vote.review_id === r._id);

            return (
              <li key={r._id || Math.random().toString(36)} className="list-group-item">
                <div className="d-flex align-items-center mb-2">
                  <div className="me-3">
                    <img
                      src={`/avatar/${r.user?.avatar}.png` || "/avatar/default.png"}
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
                  </div>
                </div>

                <div style={{ whiteSpace: "pre-wrap" }} className="ms-2 mb-2">{r.content}</div>

                {/* vote button */}
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <small className="text-muted">
                    <i className="bi bi-clock me-1"></i>
                    {formatReviewDate(r.update_time)}
                  </small>
                  <button
                    className="btn btn-link p-0 d-flex align-items-center"
                    onClick={() => isVoted ? unvoteReview(r._id) : voteReview(r._id)}
                    style={{
                      textDecoration: "none",
                      color: isVoted ? "#007bff" : "#6c757d",
                      border: "none",
                      background: "none"
                    }}
                  >
                    {isVoted ? (
                      <BiSolidLike size={18} className="me-1" />
                    ) : (
                      <BiLike size={18} className="me-1" />
                    )}
                    <span className="small">{r.voteCount || 0}</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-muted">No reviews yet</div>
      )}
    </section>
  );
}

