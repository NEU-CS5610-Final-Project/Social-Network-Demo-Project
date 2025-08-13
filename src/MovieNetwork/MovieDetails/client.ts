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