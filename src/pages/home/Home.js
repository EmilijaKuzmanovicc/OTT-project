import { series } from "../../utils/constants/Data";
import ContentSection from "./components/ContentSection";
import Channels from "./components/TopChannels";
import { Router, Lightning } from "@lightningjs/sdk";
export default class Home extends Lightning.Component {
    _props = {
        homeData: null,
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
        const { movieData, seriesData } = this._props;

        if (movieData) {
            this._Content.patch({
                visible: true,
                props: {
                    homeData: { movieData: movieData, seriesData: seriesData },
                },
            });
        }
    }

    _active() {
        this._setState('Content');
        Router.setHistory([]);
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
    _handleBack(e) {
        if (Router.isNavigating()) {
            return;
        }
        e.preventDefault();

        const routerHistory = Router.getHistory().filter(
            history => history.hash != 'splash' && history.hash != 'cmp'
        )
        if (routerHistory.length) {
            Router.back();
        }
        else {
            Router.navigate('home')
        }
    }
}