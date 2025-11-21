import Lightning from "@lightningjs/sdk/src/Lightning";
import { BRANDING_COLORS } from "../../../utils/constants/Colors";

export default class ProgressBar extends Lightning.Component {
    _props = { radius: 6, width: 1404, height: 9, markerRadius: 8 };
    _timer = 0
    static _template() {
        return {
            BackgroundBar: { w: w => w, h: h => h },
            Progress: {
                rect: true,
                w: 0,
                flex: {
                    alignItems: 'center',
                },
                h: h => h,
                color: BRANDING_COLORS.RED,
                Marker: {
                    zIndex: 20,
                    visible: false,
                    texture: lng.Tools.getRoundRect(
                        24,
                        24,
                        12,
                        3,
                        BRANDING_COLORS.WHITE,
                        true,
                        BRANDING_COLORS.RED
                    )
                }
            }
        };
    }

    get _BackgroundBar() {
        return this.tag("BackgroundBar");
    }

    get _Progress() {
        return this.tag("Progress");
    }

    get _Marker() {
        return this.tag("Progress.Marker");
    }

    set props(props) {
        this._props = { ...this._props, ...props };
        this._updateBackgroundBarTexture(0, BRANDING_COLORS.TRANSPARENT);
    }

    _updateBackgroundBarTexture(strokeWidth = 0, strokeColor = BRANDING_COLORS.TRANSPARENT) {
        const w = this._props.width || this.w || 1404;
        const h = this._props.height || this.h || 9;
        const radius = this._props.radius || 6;

        this._BackgroundBar.texture = lng.Tools.getRoundRect(
            w,
            h,
            radius,
            strokeWidth,
            strokeColor,
            BRANDING_COLORS.GREY
        );
    }

    progress(p, duration) {
        this._timer = 0
        const progressWidth = (p) * (this._props.width || this.w || 1404);


        this._Progress.setSmooth("w", progressWidth);

        this._Progress.texture =
            lng.Tools.getRoundRect(
                progressWidth,
                this._props.height,
                this._props.radius,
                0,
                BRANDING_COLORS.TRANSPARENT,
                BRANDING_COLORS.RED
            );
        this._Marker.setSmooth("x", progressWidth - this._Marker.w / 2 - this._props.markerRadius);

    }

    _getFocused() {
        return this;
    }

    _focus() {
        this._updateBackgroundBarTexture(2, BRANDING_COLORS.RED);
        this._Marker.visible = true;
    }

    _unfocus() {
        this._updateBackgroundBarTexture(0, BRANDING_COLORS.TRANSPARENT);
        this._Marker.visible = false;
    }
}
