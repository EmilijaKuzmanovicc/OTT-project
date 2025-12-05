import { Lightning, Router } from "@lightningjs/sdk";
import HorizontalContainer from "../../../components/horizontalContainer/HorizontalContainer";
import CardItem from "../../../components/cardItem/CardItem";
export default class ContentSection extends Lightning.Component {
    _props = {
        homeData: []
    }
    _lastSelectedIndex = 0;
    _lastSelectedRail = 'MoviesSection'
    static _template() {
        return {
            MoviesSection: {
                collision: true,
                w: 1241,
                h: 360,
                collision: true,
                type: HorizontalContainer
            },
            SeriesSection: {
                collision: true,
                y: 423,
                w: 1241,
                h: 404,
                collision: true,
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
                    items: homeData.movieData.slicedData.map((item, index) => ({
                        w: 241,
                        h: 359,
                        type: CardItem,
                        props: { ...item, railType: homeData.movieData.railData, parentState: "MoviesSection", index: index },

                    })),
                    targetIndex: this._lastSelectedIndex,
                    railTitle: homeData.movieData.railData,
                    disableScroll: true,
                }
            },
            SeriesSection: {
                props: {
                    items: homeData.seriesData.slicedData.map((item, index) => ({
                        w: 241,
                        h: 359,
                        type: CardItem,
                        props: { ...item, railType: homeData.seriesData.railData, parentState: "SeriesSection", index: index },
                    })),
                    targetIndex: this._lastSelectedIndex,
                    railTitle: homeData.seriesData.railData,
                    disableScroll: true,
                }
            },
        });
    }

    _active() {
        this._setState(this._lastSelectedRail)
    }

    _getFocused() {
        return this.Items?.children[0] || this;
    }

    $storeSelectedIndex(index) {
        this._lastSelectedIndex = index;
        this._lastSelectedRail = this._getState();
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