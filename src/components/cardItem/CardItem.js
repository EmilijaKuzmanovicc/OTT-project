import { Lightning, Router, Utils } from '@lightningjs/sdk'
import { BRANDING_COLORS } from '../../utils/constants/Colors'
import { Direction } from '../../utils/constants/ConstantsForStyle';
import { IMAGES_URL } from '../../utils/constants/URLs';
import { ITEMS_NAME } from '../../utils/constants/Constants';
import { URLS_VITE } from '../../utils/constants/env';
export default class CardItem extends Lightning.Component {
    _overview = '';
    _backdrop_path;
    _focusTimeout = null;
    static _template() {
        return {
            rect: true,
            y: 5,
            x: -6,
            collision: true,
            passSignals: { changeHeroBackground: true },
            color: BRANDING_COLORS.TRANSPARENT,
            flex: { direction: Direction.Column, paddingRight: 20 },
            Image: {
                w: w => w - 26,
                h: h => h - 59,
                x: 6,
                y: 6,
                alpha: 1,
                shader: {
                    type: Lightning.shaders.RoundedRectangle,
                    radius: 6,
                    stroke: 0,
                    strokeColor: BRANDING_COLORS.RED,
                },
            },
            Label: {
                y: 16,
                x: 6,
                text: {
                    fontSize: 28,
                    textColor: BRANDING_COLORS.LIGHTER_GREY,
                    wordWrap: false,
                    textOverflow: 'ellipsis',
                    maxLinesSuffix: "...",
                },
            },
        }
    }

    get _Image() { return this.tag("Image") }
    get _Label() { return this.tag("Label"); }

    set props(props) {
        this._props = { ...this._props, ...props };
        const { poster_path, title, overview, name, backdrop_path, id, parentState } = this._props;
        const poster = this._w > 250 ? backdrop_path : poster_path;
        this._id = id;
        const imageUrl = poster ? `${URLS_VITE.VITE_TMDB_IMAGE_URL_POSTER}${poster}` : Utils.asset(IMAGES_URL.IMAGE_NOT_FOUND);
        this.patch({
            Image: { src: imageUrl },
            Label: { text: { wordWrapWidth: (this._w - 10), text: title === undefined ? name : title } }
        })
        this._overview = overview;
        this._backdrop_path = imageUrl
    }

    _focus() {
        if (this._focusTimeout) {
            clearTimeout(this._focusTimeout);
        }
        this.patch({
            smooth: { scale: 1.05 },
            Image: { shader: { stroke: 6 }, },
            Label: { text: { textColor: BRANDING_COLORS.WHITE } }
        })
        this._focusTimeout = setTimeout(() => {
            this.signal('changeHeroBackground', this._Label.text.text, this._overview, this._backdrop_path, this._id);
        }, 1000);
    }

    _unfocus() {
        if (this._focusTimeout) {
            clearTimeout(this._focusTimeout);
            this._focusTimeout = null;
        }
        this.patch({
            smooth: { scale: 1.0 },
            Image: { shader: { stroke: 0 } },
            Label: { text: { textColor: BRANDING_COLORS.LIGHTER_GREY } }
        })
    }

    _handleEnter() {
        const { id, railType, index } = this._props;
        this.fireAncestors('$storeSelectedIndex', index);
        switch (railType.toUpperCase()) {
            case ITEMS_NAME.MOVIES:
                Router.navigate(`movie-details/${id}`);
                break;
            case ITEMS_NAME.SERIES:
                Router.navigate(`series-details/${id}`);
                break;
            default:
                console.warn(`Nepoznat railType: ${railType}`);
                break;
        }
    }

    _handleHover() {
        this._focus();
        this.fireAncestors("$handleItemHover", this.parent.children.indexOf(this));
    }

    _handleClick() {
        this._handleEnter()
    }
}
