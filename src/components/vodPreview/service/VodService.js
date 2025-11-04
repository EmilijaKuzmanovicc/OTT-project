import FetchingService from "../../../api/FetchingService";
import { VOD_TYPES } from "../../../utils/constants/Constants";

class VodService extends FetchingService {
    #emptyState = {
        contentStripe: undefined,
        vodStripes: undefined,
        pointer: 1,
        stripesFetched: 0,
        hasMore: true,
    }
    #initState = {
        [VOD_TYPES.MOVIES]: { ...this.#emptyState },
        [VOD_TYPES.SERIES]: { ...this.#emptyState },
    }

    #vodType;

    #state = { ...this.#initState };

    #getCurrentState = () => this.#state[this.#vodType];
}

const vodService = new VodService();

export { vodService as VodService };