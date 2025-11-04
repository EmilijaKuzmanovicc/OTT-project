import FetchingService from "../../../api/FetchingService";
import { API_URLS } from "../../../utils/constants/URLs";

class HomePageService extends FetchingService {
    #loading = false;
    #homeItems;

    get loading() {
        return this.#loading;
    }

    async fetchHomeData(page = 1) {
        this.#loading = true;
        try {
            const data = await this.#getHomeItems(page);
            this.#homeItems = data;
            return data;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        } finally {
            this.#loading = false;
        }
    }

    #getHomeItems = async (page = 1) => {
        return this._request({
            url: API_URLS.GET_MOVIES,
            method: "GET",
            params: { page },
        });
    };
}

const homePageService = new HomePageService();
export { homePageService as HomePageService };
