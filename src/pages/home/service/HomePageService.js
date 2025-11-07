import FetchingService from "../../../api/FetchingService";
import { API_URLS } from "../../../utils/constants/URLs";


class HomePageService extends FetchingService {

    #homeMovies = null;
    #homeSeries = null;

    get homeMovies() {
        return this.#homeMovies;
    }

    get homeSeries() {
        return this.#homeSeries;
    }

    async fetchHomeMoviesData(page = 1, limit = 5) {
        try {
            const data = await this.#getHomeItems(page, API_URLS.GET_MOVIES);
            const slicedData = data.results.slice(0, limit);
            this.#homeMovies = slicedData;
            return slicedData;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }

    async fetchHomeSeriesData(page = 1, limit = 5) {
        try {
            const data = await this.#getHomeItems(page, API_URLS.GET_SERIES);
            const slicedData = data.results.slice(0, limit);
            this.#homeSeries = slicedData;
            return this.#homeSeries;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }
    async #getHomeItems(page = 1, url) {
        return this._request({
            url,
            params: { page },
        });
    }
}

const homePageService = new HomePageService();

export { homePageService as HomePageService };

