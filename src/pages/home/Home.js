import ContentSection from "./components/ContentSection";
import Channels from "./components/TopChannels";
import { Router, Lightning } from "@lightningjs/sdk";
export default class Home extends Lightning.Component {
    _props = {
        homeData: null,
        railData: [],
    }
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

    set props(props) {

        this._props = { ...this._props, ...props };
        const { homeData, railData } = this._props;



    }
    _handleHover() {
        Router.focusPage();
    }

    _active() {
        this._setState('Content')
    }

    _focus() {
        this._setState('Content')
    }


    static _states() {
        return [
            class Content extends this {
                _getFocused() {
                    return this._Content;
                }
                _handleRight() {
                    this._setState('TopChannels');
                    return true;
                }
                _handleUp() {
                    Router.focusWidget('Menu');
                    return true;
                }




            },
            class TopChannels extends this {
                _getFocused() {
                    return this._TopChannels;
                }
                _handleLeft() {
                    this._setState('Content');
                    return true;
                }
            }
        ];
    }


}