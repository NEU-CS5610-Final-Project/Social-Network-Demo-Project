import { REMOTE_SERVER } from "../../MovieDetails/client";

export async function getFollowingReviews(limit = 5) {
    const res = await fetch(`${REMOTE_SERVER}/api/feed/following-reviews?limit=${limit}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error(`feed failed: ${res.status}`);
    const data = await res.json();
    return data.reviews ?? [];
  }