import Lightning from "@lightningjs/sdk/src/Lightning";
import { Align } from "../../../utils/constants/ConstantsForStyle";
import { Utils } from "@lightningjs/sdk";
import { BRANDING_COLORS } from "../../../utils/constants/Colors";

export default class PlayerButton extends Lightning.Component {
    static _template() {
        return {
            h: 90,
            flex: { alignItems: Align.Center },
            Image: {
                collision: true,

            }
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
        this.fireAncestors("$showControls");
        this._Image.color = BRANDING_COLORS.RED
    }

    _unfocus() {
        this._Image.color = BRANDING_COLORS.WHITE
    }

    _handleHover() {
        this._focus();
        this.fireAncestors("$handleItemHover", this.parent.children.indexOf(this));
    }

    _handleClick() {
        this._handleEnter();
    }
}