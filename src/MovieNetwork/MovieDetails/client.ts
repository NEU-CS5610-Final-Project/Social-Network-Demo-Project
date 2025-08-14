import axios from "axios";

export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER || "http://localhost:4000";
const axiosWithCredentials = axios.create({ withCredentials: true });

// Get movie details
export const getMovieDetails = async (movieId: string) => {
    const response = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/tmdb/details/${movieId}`);
    return response.data;
};

// Get movie reviews
export const getMovieReviews = async (movieId: string) => {
    const response = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/reviews/movie/${movieId}`);
    return response.data;
};

// Create new review
export const createReview = async (review: { movie_id: string; content: string; user_id?: string }) => {
    const response = await axiosWithCredentials.post(`${REMOTE_SERVER}/api/reviews`, review);
    return response.data;
};

// Like movie
export const likeMovie = async (movieId: string) => {
    const response = await axiosWithCredentials.post(`${REMOTE_SERVER}/api/liked/${movieId}`);
    return response.data;
};

// Unlike movie
export const unlikeMovie = async (movieId: string) => {
    const response = await axiosWithCredentials.delete(`${REMOTE_SERVER}/api/liked/${movieId}`);
    return response.data;
};

// Get movie vote information
export const getMovieVotes = async (movieId: string) => {
    const response = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/movievotes/${movieId}/count`);
    return response.data;
};

// Get user's voted reviews
export const getUserVotedReviews = async (uid: string) => {
    const response = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/users/${uid}/votedReviews`);
    return response.data;
};

// Get user's voted movies
export const getUserVotedMovies = async (uid: string) => {
    const response = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/users/${uid}/votedMovies`);
    return response.data;
};

// Get review vote count
export const getReviewVoteCount = async (reviewId: string) => {
    const response = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/reviewvote/${reviewId}`);
    return response.data;
};

// Vote for a review
export const voteReview = async (reviewId: string) => {
    const response = await axiosWithCredentials.put(`${REMOTE_SERVER}/api/reviewvote/${reviewId}`);
    return response;
};

// Unvote for a review
export const unvoteReview = async (reviewId: string) => {
    const response = await axiosWithCredentials.delete(`${REMOTE_SERVER}/api/reviewvote/${reviewId}`);
    return response;
};

// Get movie rating by movie ID
export const getUserMovieRating = async (movieId: string) => {
    const response = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/movievotes/${movieId}/currentUser`);
    return response.data;
};

// Vote for a movie
export const voteMovie = async (movieId: string, voteData: any) => {
    const response = await axiosWithCredentials.post(`${REMOTE_SERVER}/api/movievotes/${movieId}`, voteData);
    return response;
};

// Unvote for a movie
export const unvoteMovie = async (movieId: string) => {
    const response = await axiosWithCredentials.delete(`${REMOTE_SERVER}/api/movievotes/${movieId}`);
    return response;
};

// Get movie average rating
export const getMovieAverageRating = async (movieId: string) => {
    const response = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/movievotes/${movieId}/average`);
    return response.data;
};

// Delete a review
export const deleteReview = async (reviewId: string) => {
    const response = await axiosWithCredentials.delete(`${REMOTE_SERVER}/api/reviews/${reviewId}`);
    return response.data;
};

// Update a review
export const updateReview = async (reviewId: string, data: any) => {
    const response = await axiosWithCredentials.put(`${REMOTE_SERVER}/api/reviews/${reviewId}`, data);
    return response.data;
};