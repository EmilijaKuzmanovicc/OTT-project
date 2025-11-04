import { VOD_TYPES } from "../../../utils/constants/Constants";
import { VodService } from "../service/VodService";

export default async function (page, { vodType }) {

    VodService.vodType = vodType;

    let pageTitle = '';

    if (vodType === VOD_TYPES.MOVIES) {
        pageTitle = 'Movies';
    } else if (vodType === VOD_TYPES.SERIES) {
        pageTitle = 'Series';
    } else {
        pageTitle = 'Unknown VOD Type';
    }

    page.props = {
        title: pageTitle,
        vodType,
    };

}