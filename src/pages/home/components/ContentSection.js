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
                collision: true,
                w: 1241,
                h: 360,
                type: HorizontalContainer
            },
            SeriesSection: {
                collision: true,
                y: 423,
                w: 1241,
                h: 404,
                type: HorizontalContainer
            },
        }
    }

    get _MoviesSection() { return this.tag('MoviesSection') }
    get _SeriesSection() { return this.tag('SeriesSection') }
    get _LiveButton() { return this.tag('LiveButton') }

    set props(props) {
        this._props = { ...this._props, ...props };
        const { homeData, parentState } = this._props
        this.patch({
            MoviesSection: {
                props: {
                    items: homeData.movieData.slicedData.map((item) => ({
                        w: 241,
                        h: 359,
                        type: CardItem,
                        props: { ...item, railType: homeData.movieData.railData, parentState: "MoviesSection", },

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
                        props: { ...item, railType: homeData.seriesData.railData, parentState: "SeriesSection", },
                    })),
                    railTitle: homeData.seriesData.railData,
                    disableScroll: true,
                }
            },
        });
    }

    _active() {
        this._setState('MoviesSection')
    }

    _getFocused() {
        return this.Items?.children[0] || this;
    }

    $handleHoverState(ref) {
        const currentState = this._getState();
        if (ref !== currentState) {
            if (currentState) this.tag(currentState)._unfocus();
            this._setState(ref);
        }
        this.fireAncestors("$handleHoverState", this.ref);
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
            },
        ];
    }

}