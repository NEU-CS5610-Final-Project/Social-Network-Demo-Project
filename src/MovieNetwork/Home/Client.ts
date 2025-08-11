import axios from "axios";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;

export const getLatestMovies = async () => {
    const res = await axios.get(`${REMOTE_SERVER}/api/tmdb/latest`, {
      params: { lang: "en-US", page: 1 },
      withCredentials: true,
    });
    return res.data.results; // return the results
  };