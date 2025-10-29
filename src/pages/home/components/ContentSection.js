import Lightning from "@lightningjs/sdk/src/Lightning";
import HorizontalContainer from "../../../components/horizontalContainer/HorizontalContainer";
import { movies, series } from "../../../utils/Data";
import CardItem from "../../../components/cardItem/CardItem";
import { LiveButton } from "./LiveButton";

export default class ContentSection extends Lightning.Component {
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
                type: LiveButton,
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

    _init() {
        this.patch({
            MoviesSection: {
                props: {
                    items: movies.map((item) => ({
                        w: 241,
                        h: 359,
                        type: CardItem,
                        itemData: item,
                    })),
                    railTitle: "movies"
                }
            },
            SeriesSection: {
                props: {
                    items: series.map((item) => ({
                        w: 241,
                        h: 359,
                        type: CardItem,
                        itemData: item,
                    })),
                    railTitle: "series"
                }
            }
        });
        // this._setupSection(this._MoviesSection, movies, "movies");
        // this._setupSection(this._SeriesSection, series, "series");

        this._setState('MoviesSection');
    }

    _setupSection(section, items, title) {
        section.props = {
            items: items.map((item) => ({
                w: 241,
                h: 359,
                type: CardItem, itemData: item,
            })),
            railTitle: title
        };
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
}