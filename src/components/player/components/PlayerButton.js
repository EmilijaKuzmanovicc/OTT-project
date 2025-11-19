import { Utils } from "@lightningjs/sdk";
import Lightning from "@lightningjs/sdk/src/Lightning";
import { BRANDING_COLORS } from "../../../utils/constants/Colors";
import { Align } from "../../../utils/constants/ConstantsForStyle";

export default class PlayerButton extends Lightning.Component {
    static _template() {
        return {
            w: 70,
            h: 90,
            flex: { alignItems: Align.Center },
            Image: {

            }
        }
    }

    get _Image() {
        return this.tag("Image")
    }
    set props(props) {
        this._props = { ...this._props, ...props };
        const { x, r, visible, image } = this._props;
        this.patch({
            Image: {
                x: x,
                visible: visible,
                texture: lng.Tools.getSvgTexture(Utils.asset(image), r, r),
            }
        })
    }

    _focus() {
        this._Image.color = BRANDING_COLORS.RED
    }

    _unfocus() {
        this._Image.color = BRANDING_COLORS.WHITE
    }
}