import { MovieService } from "../service/MovieService";

export default async function (page) {
    try {
        const id = page.params.movieId;
        const movieDetail = await MovieService.getMovie(id);
        const { actors, directorNames } = await MovieService.getCasts(id);

        page.props = {
            details: movieDetail,
            actors: actors,
            directors: directorNames
        }

    } catch (e) {
        console.error("Error:", e);
    }
}