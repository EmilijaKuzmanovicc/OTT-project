import Button from "../../components/button/Button";
import ContentSection from "./components/ContentSection";
import Channels from "./components/TopChannels";
import { Router, Lightning } from "@lightningjs/sdk";
export default class Home extends Lightning.Component {
    _props = {
        homeData: null,
    }
    static _template() {
        return {
            collision: true,
            Content: {
                collision: true,
                x: 64,
                y: 125,
                w: 1270,
                h: 825,
                type: ContentSection,
            },
            LiveButton: {
                y: 971,
                x: 64,
                type: Button,
            },
            TopChannels: {
                collision: true,
                y: 122,
                x: 1415,
                type: Channels
            },

        };
    }

    get _Content() { return this.tag('Content'); }
    get _LiveButton() { return this.tag("LiveButton"); }
    get _TopChannels() { return this.tag('TopChannels'); }

    set props(props) {
        this._props = { ...this._props, ...props };
        const { movieData, seriesData } = this._props;

        if (movieData) {
            this._Content.patch({
                visible: true,
                props: {
                    homeData: { movieData: movieData, seriesData: seriesData },
                    parentState: "Content",
                },
            });
        }

        this._TopChannels.patch({
            props: {
                parentState: "TopChannels",
            }
        })

        this.patch({
            LiveButton: {
                w: 352,
                h: 67,
                props: { fontSize: 24, text: "GO TO LIVE PLAYER", letterSpacing: 2, },
            }
        })
    }

    _active() {
        this._setState('Content');
        Router.setHistory([]);
    }

    _handleBack(e) {
        if (Router.isNavigating()) return;
        e.preventDefault();

        this.fireAncestors('$appClose');
    }

    _focus() {
        this._setState('Content')
    }

    $handleHoverState(ref) {
        if (Router.getActiveHash()) {
            Router.focusPage();
        }
        const currentState = this._getState();
        if (ref !== currentState) {
            if (currentState) this.tag(currentState)._unfocus();
            this._setState(ref);
        }
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
                _handleDown() {
                    this._setState("LiveButton")
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
            },
            class LiveButton extends this{
                _getFocused() {
                    return this._LiveButton;
                }
                _handleUp() {
                    this._setState('Content');
                    return true;
                }
            }
        ];
    }
}