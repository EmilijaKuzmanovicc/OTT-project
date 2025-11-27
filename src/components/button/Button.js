import { Lightning, Utils } from "@lightningjs/sdk";
import { BRANDING_COLORS } from "../../utils/constants/Colors";
import { Align, Direction, Fonts } from "../../utils/constants/ConstantsForStyle";

export default class Button extends Lightning.Component {
    static _template() {
        return {
            Background: {
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
                flex: {
                    direction: Direction.Row, justifyContent: Align.Center,
                    alignItems: Align.Center,

                },
                Icon: {

                },
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

    get _Items() {
        return this.tag("Items")
    }
    get _Background() {
        return this.tag("Background")
    }
    set props(props) {
        this._props = { ...this._props, ...props }
        const { src, text, color, radius, size, font, letterSpacing, onEnter } = this._props;
        const radiusValue = radius ?? 35;
        const fontValue = font ?? 20;
        const letterSpacingValue = letterSpacing ?? 1;
        const hasIcon = !!src;
        const hasText = !!text;
        this.patch({
            Background: {
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
            Background: { color: BRANDING_COLORS.RED }
        });
    }

    _unfocus() {
        this.patch({
            Background: { color: BRANDING_COLORS.GREY }
        });
    }

    _handleEnter() {
        console.log("enter");

        if (this._props.onEnter) {
            this._props.onEnter();
        }

    }
}
