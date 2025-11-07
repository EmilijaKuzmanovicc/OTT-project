import { ROUTES_INDEX } from "./constants/Constants";

export function getRouteNavbarIndex(route) {
    const indexes = {
        ...ROUTES_INDEX
    };
    if (route) {
        return indexes[route] ?? 0;
    }

    return 0;
}