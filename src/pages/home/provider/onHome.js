import { ITEMS_NAME } from "../../../utils/constants/Constants";
import { HomePageService } from "../service/HomePageService";


export default async function (page) {
    try {
        const [slicedMovieData, slicedSeriesData] = await Promise.all([
            HomePageService.fetchHomeMoviesData(),
            HomePageService.fetchHomeSeriesData()
        ]);

        page.props = {
            movieData: { slicedData: slicedMovieData, railData: ITEMS_NAME.MOVIES, },
            seriesData: { slicedData: slicedSeriesData, railData: ITEMS_NAME.SERIES, },
        };

    } catch (e) {
        console.error("Error:", e);
    }
}
