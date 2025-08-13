import axios from "axios";
export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
export const USERS_API = `${REMOTE_SERVER}/api/users`;
export const FOLLOW_API = `${REMOTE_SERVER}/api/follow`;
export const MOVIES_API = `${REMOTE_SERVER}/api/tmdb`;
export const REVIEWVOTE_API = `${REMOTE_SERVER}/api/reviewvote`;
const axiosWithCredentials = axios.create({ withCredentials: true });

export const signin = async (credentials: any) => {
    const response = await axiosWithCredentials.post(`${USERS_API}/signin`, credentials);
    return response.data;
};

export const signup = async (credentials: any) => {
    const response = await axiosWithCredentials.post(`${USERS_API}/signup`, credentials);
    return response.data;
};

export const updateProfile = async (profileData: any) => {
    const response = await axiosWithCredentials.put(`${USERS_API}/${profileData._id}`, profileData);
    return response.data;
};

export const signout = async () => {
    const response = await axiosWithCredentials.post(`${USERS_API}/signout`);
    return response.data;
};

export const profile = async () => {
    const response = await axiosWithCredentials.post(`${USERS_API}/profile`);
    return response.data;
};

export const findProfile = async (uid: string) => {
    const response = await axiosWithCredentials.get(`${USERS_API}/profile/${uid}`);
    return response.data;
};

export const followUser = async (uid: string) => {
    const response = await axiosWithCredentials.post(`${FOLLOW_API}/${uid}`);
    return response.data;
};

export const unfollowUser = async (uid: string) => {
    const response = await axiosWithCredentials.delete(`${FOLLOW_API}/${uid}`);
    return response.data;
};

export const getMovieTitleById = async (movieId: string) => {
    const response = await axiosWithCredentials.get(`${MOVIES_API}/details/${movieId}`);
    return response.data.title;
};

export const getReviewVoteById = async (reviewId: string) => {
    const response = await axiosWithCredentials.get(`${REVIEWVOTE_API}/${reviewId}`);
    return response.data;
};

export const getMoviePosterById = async (movieId: string) => {
    const response = await axiosWithCredentials.get(`${MOVIES_API}/poster`, { params: { id: movieId } });
    return response.data.url;
};

export const changePassword = async (passwordData: any, uid: string) => {
    const response = await axiosWithCredentials.put(`${USERS_API}/${uid}/password`, passwordData);
    return response.data;
};