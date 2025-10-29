import Lightning from "@lightningjs/sdk/src/Lightning";
import ContentSection from "./components/ContentSection";
import Channels from "./components/TopChannels";
import { BRANDING_COLORS } from "../../utils/Colors";
import { Align, Fonts } from "../../utils/Constants";

export default class Home extends Lightning.Component {
    static _template() {
        return {
            Content: {
                x: 64,
                y: 125,
                w: 1920,
                h: 980,
                type: ContentSection,
            },
            TopChannels: {
                y: 122,
                x: 1415,

                type: Channels
            },

        };
    }

    get _Content() {
        return this.tag('Content');
    }

    get _TopChannels() {
        return this.tag('TopChannels');
    }

    _init() {
        this._setState('Content')
    }

    static _states() {
        return [
            class Content extends this{
                _getFocused() {
                    return this._Content;
                }
                _handleRight() {
                    this._setState('TopChannels');
                    return true;
                }
            },
            class TopChannels extends this{
                _getFocused() {
                    return this._TopChannels;
                }
                _handleLeft() {
                    this._setState('Content');
                    return true;
                }
            }
        ]
    }

}