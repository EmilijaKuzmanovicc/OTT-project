import { Utils } from "@lightningjs/sdk";
import Lightning from "@lightningjs/sdk/src/Lightning";
import { BRANDING_COLORS } from "../../../utils/constants/Colors";
import { Align } from "../../../utils/constants/ConstantsForStyle";
export default class PlayerButton extends Lightning.Component {
    static _template() {
        return {
            h: 90,
            flex: { alignItems: Align.Center },
            Image: {}
        }
    }

    get _Image() { return this.tag("Image") }
    set props(props) {
        this._props = { ...this._props, ...props };
        this._updateFromProps();
    }

    _updateFromProps() {
        const { x, r, visible, image, onEnter } = this._props || {};

        if (r != null) this.w = r;
        if (x != null) this._Image.x = x;
        if (visible != null) this._Image.visible = visible;

        if (image) {
            this._Image.texture = lng.Tools.getSvgTexture(
                Utils.asset(image),
                r,
                r
            );
        }

        this._onEnter = onEnter;
    }
    _handleEnter() {
        if (this._onEnter) {
            this._onEnter();
            this.fireAncestors("$showControls");
        }
    }

    _focus() {
        this._Image.color = BRANDING_COLORS.RED
    }

    _unfocus() {
        this._Image.color = BRANDING_COLORS.WHITE
    }
}