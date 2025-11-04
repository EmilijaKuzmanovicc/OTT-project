import { api } from "./api";

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
            this.#loading = false;
            return response.data;
        } catch (error) {
            this.#loading = false;
            this.#handleError(error);
            throw error;
        }
    }

    #handleError(error) {
        if (import.meta.env.MODE === "development") {
            if (error.response) {
                console.error("Status:", error.response.status);
                console.error("Data:", error.response.data);
            } else {
                console.error("Error Message:", error.message);
            }
        }
    }
}
