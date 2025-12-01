import { Lightning, Utils } from "@lightningjs/sdk";
import { BRANDING_COLORS } from "../../utils/constants/Colors";
import { Align, Direction, Fonts } from "../../utils/constants/ConstantsForStyle";

export default class Button extends Lightning.Component {
    static _template() {
        return {
            collision: true,
            FillColor: {
                w: w => w,
                h: h => h,
                rect: true,
                color: BRANDING_COLORS.GREY,
                shader: {
                    type: Lightning.shaders.RoundedRectangle,
                },
            },
            Items: {
                h: h => h,
                w: w => w,
                flex: { direction: Direction.Row, justifyContent: Align.Center, alignItems: Align.Center, },
                Icon: {},
                Text: {
                    x: 10,
                    y: 2,
                    text: {
                        fontFace: Fonts.SemiBold,
                        textColor: BRANDING_COLORS.WHITE,
                    }
                }
            }
        }
    }

    get _Items() { return this.tag("Items") }

    get _FillColor() { return this.tag("FillColor") }

    set props(props) {
        this._props = { ...this._props, ...props }
        const { src, text, radius, size, font, letterSpacing } = this._props;
        const radiusValue = radius ?? 35;
        const fontValue = font ?? 20;
        const letterSpacingValue = letterSpacing ?? 1;
        const hasIcon = !!src;
        const hasText = !!text;
        this.patch({
            FillColor: {
                shader: {
                    radius: radiusValue,
                },
            },
            Items: {
                Icon: {
                    visible: hasIcon,
                    w: size,
                    h: size,
                    texture: lng.Tools.getSvgTexture(Utils.asset(src), fontValue, fontValue)
                },
                Text: {
                    visible: hasText,
                    text: {

                        fontSize: fontValue,
                        text: text,
                        letterSpacing: letterSpacingValue,
                    }
                }
            }
        });
    }

    _focus() {
        this.patch({
            FillColor: { color: BRANDING_COLORS.RED }
        });
    }

    _unfocus() {
        this.patch({
            FillColor: { color: BRANDING_COLORS.GREY }
        });
    }

    _handleEnter() {
        if (this._props.onRemoteEnter)
            this._props.onRemoteEnter();

    }

    _handleHover() {
        this._focus();
        this.fireAncestors('$handleHoverState', this.ref);
    }

    _handleClick() {
        this._handleEnter();
    }
}
