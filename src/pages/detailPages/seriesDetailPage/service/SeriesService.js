import FetchingService from "../../../../api/FetchingService";
import { API_URLS } from "../../../../utils/constants/URLs";

class SeriesService extends FetchingService {
    #details = null;
    #casts = null;
    get details() {
        return this.#details;
    }
    get casts() {
        return this.#casts;
    }

    async getSeries(id) {
        try {
            const data = await this.#getSeriesDetails(id);
            this.#details = data;
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
    async getCasts(id) {
        try {
            const data = await this.#getCastsDetail(id);
            this.#casts = data;
            const actors = data.cast.slice(0, 5);
            const directorNames = data.crew
                .filter(e => e.job === "Director")
                .map(e => e.name);

            return { actors, directorNames };
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    async #getSeriesDetails(id) {
        return this._request({
            url: `${API_URLS.SERIES_DETAIL}/${id}`,
        });
    }
    async #getCastsDetail(id) {
        return this._request({
            url: `${API_URLS.SERIES_DETAIL}/${id}${API_URLS.CREDITS}`,
        });
    }
}

const seriesService = new SeriesService();

export { seriesService as SeriesService };
