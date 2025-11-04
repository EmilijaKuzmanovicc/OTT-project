import { Lightning } from "@lightningjs/sdk";
import { BRANDING_COLORS } from "../../../utils/constants/Colors";
import { Align, Fonts } from "../../../utils/constants/ConstantsForStyle";

export class LiveButton extends Lightning.Component {

    static _template() {
        return {
            w: 352,
            h: 67,
            rect: true,
            color: BRANDING_COLORS.GREY,
            shader: {
                type: Lightning.shaders.RoundedRectangle,
                radius: 35,
            },
            Text: {
                x: w => w / 2,
                y: h => h / 2,
                mountX: 0.5,
                mountY: 0.5,
                text: {
                    fontFace: Fonts.SemiBold,
                    fontSize: 24,
                    letterSpacing: 2,
                    textAlign: Align.Center,
                    textColor: BRANDING_COLORS.WHITE,
                    text: "GO TO LIVE PLAYER",
                }
            }
        }
    }
    _focus() {
        this.patch({
            color: BRANDING_COLORS.RED
        })
    }

    _unfocus() {
        this.patch({
            color: BRANDING_COLORS.GREY
        })
    }
}