import { SeriesService } from "../service/SeriesService";

export default async function (page) {
    try {
        const id = page.params.seriesId;
        const seriesDetail = await SeriesService.getSeries(id);
        const { actors, directorNames } = await SeriesService.getCasts(id);

        page.props = {
            details: seriesDetail,
            actors: actors,
            directors: directorNames
        }

    } catch (e) {
        console.error("Error:", e);
    }
}