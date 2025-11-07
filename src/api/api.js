import axios from "axios";
import { URLS_VITE } from "../utils/constants/env";

export const api = axios.create({
    baseURL: URLS_VITE.VITE_API_URL,
    headers: {
        Authorization: `Bearer ${URLS_VITE.VITE_APP_API_KEY}`,
    },
    params: {
        api_key: URLS_VITE.VITE_APP_API_KEY,
    },
});
