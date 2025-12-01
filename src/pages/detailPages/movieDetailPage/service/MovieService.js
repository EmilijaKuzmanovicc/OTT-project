import FetchingService from "../../../../api/FetchingService";
import { API_URLS } from "../../../../utils/constants/URLs";

class MovieService extends FetchingService {
    #details = null;
    #casts = null;

    get details() { return this.#details; }
    get casts() { return this.#casts; }

    async getMovie(id) {
        try {
            const data = await this.#getMovieDetails(id);
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

    async #getMovieDetails(id) {
        return this._request({
            url: `${API_URLS.MOVIE_DETAIL}/${id}`,
        });
    }
    async #getCastsDetail(id) {
        return this._request({
            url: `${API_URLS.MOVIE_DETAIL}/${id}${API_URLS.CREDITS}`,
        });
    }
}

const movieService = new MovieService();

export { movieService as MovieService };
