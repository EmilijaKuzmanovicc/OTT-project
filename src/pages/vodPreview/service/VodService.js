import FetchingService from "../../../api/FetchingService";
import { API_URLS } from "../../../utils/constants/URLs";


class VodService extends FetchingService {
    #movies = null;
    #series = null;

    get movies() { return this.#movies }
    get series() { return this.#series }

    async getMoviesOnPage(page = 1) {
        try {
            const data = await this.#getToWatch(page, API_URLS.NOW_PLAYING_MOVIES);
            this.#movies = data.results;
            return this.#movies;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }
    async getSeriesOnPage(page = 1) {
        try {
            const data = await this.#getToWatch(page, API_URLS.ON_THE_AIR_SERIES);
            this.#series = data.results;
            return this.#series;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }
    async #getToWatch(page = 1, url) {
        return this._request({
            url,
            params: { page },
        });
    }
}

const vodService = new VodService();

export { vodService as VodService };