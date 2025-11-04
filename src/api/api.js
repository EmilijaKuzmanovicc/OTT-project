import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        Authorization: `Bearer ${import.meta.env.VITE_APP_API_KEY}`,
    },
    params: {
        api_key: import.meta.env.VITE_APP_API_KEY,
    },
});
