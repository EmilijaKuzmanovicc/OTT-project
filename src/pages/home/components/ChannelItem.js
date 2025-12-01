import { Lightning, Utils } from '@lightningjs/sdk';
import { BRANDING_COLORS } from '../../../utils/constants/Colors';
import { Align, Fonts } from '../../../utils/constants/ConstantsForStyle';
export default class ChannelItem extends Lightning.Component {
    static _template() {
        return {
            collision: true,
            w: 280,
            h: 136,
            flexItem: { marginBottom: 16 },
            Background: {
                w: 280,
                h: 136,
                rect: true,
                color: BRANDING_COLORS.LIGHT_BLACK,
                shader: {
                    type: Lightning.shaders.RoundedRectangle,
                    radius: 16,
                    stroke: 0,
                    strokeColor: BRANDING_COLORS.RED,
                },
            },
            ImageWrapper: {
                w: 120,
                h: 60,
                mountX: 0.5,
                mountY: 0.9,
                x: 140,
                y: 71,
                Image: {
                    w: 120,
                    h: 70,
                },
            },
            Text: {
                mountX: 0.5,
                x: 140,
                y: 95,
                text: {
                    text: '',
                    fontSize: 16,
                    fontFace: Fonts.Inter,
                    letterSpacing: 0,
                    textColor: BRANDING_COLORS.LIGHTER_GREY,
                    textAlign: Align.Center,
                },
            },
        };
    }

    get _Background() { return this.tag('Background'); }
    get _Text() { return this.tag('Text') }
    get _Image() { return this.tag('Image') }

    set props(data) {
        this.patch({
            ImageWrapper: {
                Image: {
                    texture: lng.Tools.getSvgTexture(
                        Utils.asset(data.image),
                        70,
                        70
                    ),
                },
            },
            Text: { text: { text: data.name } },
        });
    }

    _focus() {
        this.patch({
            Background: { shader: { stroke: 4 } },
            Text: { text: { textColor: BRANDING_COLORS.WHITE, } }
        })
    }

    _unfocus() {
        this.patch({
            Background: { shader: { stroke: 0 } },
            Text: { text: { textColor: BRANDING_COLORS.LIGHTER_GREY, } }
        })
    }

    _handleHover() {
        this._focus()
        this.fireAncestors("$handleItemHover", this.parent.children.indexOf(this));
    }
}
