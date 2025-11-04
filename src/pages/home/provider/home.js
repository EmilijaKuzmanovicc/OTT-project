import { HomePageService } from "../service/HomePageService";

export default async function (page) {
    if (page._props.homeData !== null && page._props.railData) {
        return;
    }

    const data = await HomePageService.fetchHomeData();

}