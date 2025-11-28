import { Router, Utils, Lightning } from "@lightningjs/sdk";
import { IMAGES_URL } from "../../utils/constants/URLs";

export default class Splash extends Lightning.Component {
    static _template() {
        return {
            Background: {
                rect: true,
                w: 1920,
                h: 1080,
                src: Utils.asset(IMAGES_URL.BACKGROUND),
                // zIndex: 1,
            },
            Logo: {
                w: 900,
                h: 150,
                mountX: 0.5,
                mountY: 0.5,
                x: 1920 / 2,
                y: 1080 / 2,
                src: Utils.asset(IMAGES_URL.SHINDIRI),
                // zIndex: 2,
            }
        }
    }
    async _active() {
        //await CMPService.initialFetch?.();
        setTimeout(() => {
            Router.navigate('home', false);
        }, 3000);
    }
    _disable() {
        if (this._intervalID) {
            clearInterval(this._intervalID);
            this._intervalID = null;
        }
    }
}
