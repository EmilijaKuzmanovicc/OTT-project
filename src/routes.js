import MovieDetalPage from "./pages/detailPages/movieDetailPage/MovieDetailPage";
import onMovieDetail from "./pages/detailPages/movieDetailPage/provider/onMovieDetail";
import SeriesDetalPage from "./pages/detailPages/seriesDetailPage/SeriesDetailPage";
import onSeriesDetail from "./pages/detailPages/seriesDetailPage/provider/onSeriesDetail";
import Home from "./pages/home/Home";
import onHome from "./pages/home/provider/onHome";
import Player from "./pages/player/Player";
import Splash from "./pages/splashPage/Splash";
import VodPreview from "./pages/vodPreview/VodPreview";
import onVod from "./pages/vodPreview/provider/onVod";
import { ROUTES_PATHS } from "./utils/constants/Constants";

export default {
    root: ROUTES_PATHS.SPLASH,
    routes: [
        {
            path: ROUTES_PATHS.SPLASH,
            component: Splash
        },
        {
            path: ROUTES_PATHS.HOME,
            component: Home,
            widgets: ['Menu'],
            on: onHome,
        },
        {
            path: ROUTES_PATHS.VOD,
            component: VodPreview,
            widgets: ['Menu'],
            on: onVod
        },
        {
            path: ROUTES_PATHS.MOVIE_DETAILS,
            component: MovieDetalPage,
            on: onMovieDetail
        },
        {
            path: ROUTES_PATHS.SERIES_DETAILS,
            component: SeriesDetalPage,
            on: onSeriesDetail
        },
        {
            path: ROUTES_PATHS.PLAYER,
            component: Player,
        }
    ]
}