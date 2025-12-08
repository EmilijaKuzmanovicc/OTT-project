import { VOD_TYPES } from "../../../utils/constants/Constants";
import { VodService } from "../service/VodService";

export default async function (page, { vodType }) {

    VodService.vodType = vodType;
    let pageTitle = '';
    let data = [];

    if (vodType === VOD_TYPES.MOVIES) {
        pageTitle = 'Movies';
        data = await VodService.getMoviesOnPage();
    } else if (vodType === VOD_TYPES.SERIES) {
        pageTitle = 'Series';
        data = await VodService.getSeriesOnPage();
    } else {
        pageTitle = 'Unknown VOD Type';
    }
    page.props = {
        title: pageTitle,
        vodType,
        data: data,
        overview: "Select " + vodType,
    };

}