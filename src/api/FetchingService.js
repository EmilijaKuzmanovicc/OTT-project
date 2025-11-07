import { api } from '../api/api.js'
export default class FetchingService {
    static instance = null;

    static init() {
        if (!FetchingService.instance) {
            FetchingService.instance = new FetchingService();
        }
        return FetchingService.instance;
    }

    #loading = false;

    get loading() {
        return this.#loading;
    }

    async _request({ url, method = "GET", data = null, params = {} }) {
        this.#loading = true;

        try {
            const response = await api.request({
                url,
                method,
                data,
                params,
            });
            return response.data;
        } catch (error) {
            this.#handleError(error);
            throw error;
        } finally {
            this.#loading = false;
        }
    }

    #handleError(error) {
        if (import.meta.env.MODE === "development") {
            console.error("API Error:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
        }
    }
}
