import axios from "axios";
export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
export const USERS_API = `${REMOTE_SERVER}/api/users`;

const axiosWithCredentials = axios.create({ withCredentials: true });

export const searchUsers = async (username: string) => {
    const response = await axiosWithCredentials.get(`${USERS_API}/search`, {
        params: { name: username }
    });
    return response.data;
};

export const updateUser = async (userId: string, data: any) => {
    const response = await axiosWithCredentials.put(`${USERS_API}/${userId}`, data);
    return response.data;
};

export const deleteUser = async (userId: string) => {
    const response = await axiosWithCredentials.delete(`${USERS_API}/${userId}`);
    return response.data;
};