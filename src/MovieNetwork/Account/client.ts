import axios from "axios";
export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
export const USERS_API = `${REMOTE_SERVER}/api/users`;
const axiosWithCredentials = axios.create({ withCredentials: true });

export const signin = async (credentials: any) => {
    const response = await axiosWithCredentials.post(`${USERS_API}/signin`, credentials);
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