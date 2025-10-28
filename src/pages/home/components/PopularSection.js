import Lightning from "@lightningjs/sdk/src/Lightning";
import HorizontalContainer from "../../../components/horizontalContainer/HorizontalContainer";
import { movies, series } from "../../../utils/Data";
import CardItem from "../../../components/cardItem/CardItem";
import { BRANDING_COLORS } from "../../../utils/Colors";

export default class ContentSection extends Lightning.Component {
    static _template() {
        return {
            MoviesSection: {
                x: 0,
                y: 0,
                w: 1241,
                h: 360,
                type: HorizontalContainer
            },

            SeriesSection: {
                x: 0,
                y: 423,
                w: 1241,
                h: 404,
                type: HorizontalContainer
            }
        }
    }
    get _Text() {
        return this.tag('Text')
    }
    get _Text2() {
        return this.tag('Text2')
    }
    get _MoviesSection() {
        return this.tag('MoviesSection')
    }
    get _SeriesSection() {
        return this.tag('SeriesSection')
    }
    _init() {
        this._setupSection(this._MoviesSection, movies, "MOVIES");
        this._setupSection(this._SeriesSection, series, "SERIES");

        this._setState('MoviesSection');
    }

    _setupSection(section, items, title) {
        section.props = {
            items: items.map((item) => ({ type: CardItem, itemData: item, })),
            railTitle: title
        };
    }

    _getFocused() {

        switch (this._getState()) {
            case 'MoviesSection': return this._MoviesSection;
            case 'SeriesSection': return this._SeriesSection;
        }
    }

    static _states() {
        return [
            class MoviesSection extends this {
                _handleDown() {
                    this._setState('SeriesSection');
                    return true;
                }
            },
            class SeriesSection extends this {
                _handleUp() {
                    this._setState('MoviesSection');
                    return true;
                }
            }
        ];
    }
}