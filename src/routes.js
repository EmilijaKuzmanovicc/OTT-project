import Splash from "./components/splashPage/Splash";
import VodPreview from "./components/vodPreview/VodPreview";
import onVod from "./components/vodPreview/provider/onVod";
import Home from "./pages/home/Home";
import home from "./pages/home/provider/home";

export default {
    root: 'splash',
    routes: [
        {
            path: 'splash',
            component: Splash
        },
        {
            path: 'home',
            component: Home,
            widgets: ['Menu'],
            on: home,
        },
        {
            path: 'vod/:vodType',
            component: VodPreview,
            widget: ['Menu'],
            on: onVod
        }
    ]
}