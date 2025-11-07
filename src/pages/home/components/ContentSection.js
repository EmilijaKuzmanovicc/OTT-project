import { Lightning, Router } from "@lightningjs/sdk";
import HorizontalContainer from "../../../components/horizontalContainer/HorizontalContainer";
import CardItem from "../../../components/cardItem/CardItem";
import Button from "../../../components/button/Button";

export default class ContentSection extends Lightning.Component {
    _props = {
        homeData: []
    }
    static _template() {
        return {
            MoviesSection: {
                w: 1241,
                h: 360,
                type: HorizontalContainer
            },
            SeriesSection: {
                y: 423,
                w: 1241,
                h: 404,
                type: HorizontalContainer
            },
            LiveButton: {
                y: 846,
                type: Button,
            }
        }
    }

    get _MoviesSection() {
        return this.tag('MoviesSection')
    }

    get _SeriesSection() {
        return this.tag('SeriesSection')
    }

    get _LiveButton() {
        return this.tag('LiveButton')
    }
    set props(props) {
        this._props = { ...this._props, ...props };
        const { homeData } = this._props

        this.patch({
            MoviesSection: {
                props: {
                    items: homeData.movieData.slicedData.map((item) => ({
                        w: 241,
                        h: 359,
                        type: CardItem,
                        props: { ...item, railType: homeData.movieData.railData },
                    })),
                    railTitle: homeData.movieData.railData,
                    disableScroll: true,

                }
            },
            SeriesSection: {
                props: {
                    items: homeData.seriesData.slicedData.map((item) => ({
                        w: 241,
                        h: 359,
                        type: CardItem,
                        props: { ...item, railType: homeData.seriesData.railData },
                    })),
                    railTitle: homeData.seriesData.railData,
                    disableScroll: true,
                }
            },
            LiveButton: {
                w: 352,
                h: 67,
                props: { fontSize: 24, text: "GO TO LIVE PLAYER", letterSpacing: 2 }

            }
        });
    }

    _active() {
        this._setState('MoviesSection')
    }

    static _states() {
        return [
            class MoviesSection extends this {
                _getFocused() {
                    return this._MoviesSection;
                }
                _handleDown() {
                    this._setState('SeriesSection');
                    return true;
                }
                _handleUp() {
                    Router.focusWidget('Menu')
                    return true;
                }
            },
            class SeriesSection extends this {
                _getFocused() {
                    return this._SeriesSection;
                }
                _handleUp() {
                    this._setState('MoviesSection');
                    return true;
                }
                _handleDown() {
                    this._setState('LiveButton');
                    return true;
                }

            },
            class LiveButton extends this{
                _getFocused() {
                    return this._LiveButton;
                }
                _handleUp() {
                    this._setState('SeriesSection');
                    return true;
                }
            }
        ];
    }
    _getFocused() {
        return this.Items?.children[0] || this;
    }
}