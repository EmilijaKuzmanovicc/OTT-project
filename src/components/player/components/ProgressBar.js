import Lightning from "@lightningjs/sdk/src/Lightning";
import { BRANDING_COLORS } from "../../../utils/constants/Colors";
import { VideoPlayer } from "@lightningjs/sdk";
import { formatTime } from "../utils/formatTime";
import { Align, Fonts } from "../../../utils/constants/ConstantsForStyle";
import { computeSeekTime } from "../utils/computeSeekTime";

export default class ProgressBar extends Lightning.Component {
    _props = { radius: 6, width: 1404, height: 9, markerRadius: 8 };
    _newTime = null;
    _numOfTriggers = 0;
    _speedUpTimer = null;
    _direction = null;

    static _template() {
        return {
            CurrentTime: {
                w: 119,
                h: 31,
                rect: true,
                color: BRANDING_COLORS.WHITE,
                text: {
                    fontFace: Fonts.InterBold,
                    fontSize: 26,
                    textColor: BRANDING_COLORS.WHITE,
                    letterSpacing: 1
                }
            },
            ProgressBar: {
                w: 1404,
                h: 13,
                BackgroundBar: {},
                Progress: {
                    rect: true,
                    w: 0,
                    flex: { alignItems: 'center' },
                    h: h => h,
                    color: BRANDING_COLORS.RED,
                    Marker: {
                        zIndex: 20,
                        visible: true,
                        texture: lng.Tools.getRoundRect(
                            24, 24, 12, 3,
                            BRANDING_COLORS.WHITE,
                            true,
                            BRANDING_COLORS.RED
                        )
                    }
                }
            },
            EndTime: {
                w: 119,
                h: 31,
                text: {
                    fontFace: Fonts.InterBold,
                    fontSize: 26,
                    textColor: BRANDING_COLORS.WHITE,
                    letterSpacing: 1,
                    textAlign: Align.Right
                }
            }
        };
    }

    get _CurrentTime() { return this.tag("CurrentTime"); }
    get _EndTime() { return this.tag("EndTime"); }
    get _BackgroundBar() { return this.tag("ProgressBar.BackgroundBar"); }
    get _Progress() { return this.tag("ProgressBar.Progress"); }
    get _Marker() { return this.tag("ProgressBar.Progress.Marker"); }

    set props(props) {
        this._props = { ...this._props, ...props };
        this._updateBackgroundBarTexture(2, BRANDING_COLORS.TRANSPARENT);
    }

    _updateBackgroundBarTexture(strokeWidth, strokeColor = BRANDING_COLORS.TRANSPARENT) {
        const w = this._props.width;
        const h = this._props.height;
        const radius = this._props.radius;
        this._BackgroundBar.texture = lng.Tools.getRoundRect(
            w,
            h,
            radius,
            strokeWidth,
            strokeColor,
            BRANDING_COLORS.GREY
        );
    }

    progress(p) {
        const progressWidth = p * this._props.width;
        this._Progress.setSmooth("w", progressWidth);
        this._Progress.texture = lng.Tools.getRoundRect(
            progressWidth,
            this._props.height,
            this._props.radius,
            0,
            BRANDING_COLORS.TRANSPARENT,
            BRANDING_COLORS.RED
        );
        this._Marker.setSmooth("x", progressWidth - this._Marker.w / 2 - this._props.markerRadius);
    }

    _getFocused() { return this; }

    _focus() {
        this._updateBackgroundBarTexture(2, BRANDING_COLORS.RED);
        this._Marker.visible = true;
    }

    _unfocus() {
        this._updateBackgroundBarTexture(0, BRANDING_COLORS.TRANSPARENT);
        this._Marker.visible = false;
    }

    _updateProgressBar() {
        const time = this._newTime != null ? this._newTime : VideoPlayer.currentTime;
        this._CurrentTime.text = formatTime(time);
        if (VideoPlayer.duration - time < 1) {
            this.fireAncestors("$setIsEnded", true)
            this.fireAncestors("$updateControlsIcons");
        }
        else {
            if (this._isEnd) {
                this.fireAncestors("$setIsEnded", false)
                this.fireAncestors("$updateControlsIcons");
            }


            // this.fireAncestors("$updateControlsIcons");
        }

        if (VideoPlayer.duration > 0) this.progress(time / VideoPlayer.duration);
    }


    _handleRight() {
        if (this._direction !== 'right') {
            this._direction = 'right';
            this._numOfTriggers = 0;
        }
        if (!this._speedUpTimer) {
            this._speedUpTimer = setInterval(() => {
                if (this._numOfTriggers < 25) this._numOfTriggers += 5;
            }, 500);
        }
        if (this._newTime == null) this._newTime = VideoPlayer.currentTime;
        this._newTime = computeSeekTime(5 + this._numOfTriggers, this._newTime);
        this._updateProgressBar();
    }

    _handleLeft() {
        if (this._direction !== 'left') {
            this._direction = 'left';
            this._numOfTriggers = 0;
        }
        if (!this._speedUpTimer) {
            this._speedUpTimer = setInterval(() => {
                if (this._numOfTriggers < 25) this._numOfTriggers += 5;
            }, 500);
        }
        if (this._newTime == null) this._newTime = VideoPlayer.currentTime;
        this._newTime = computeSeekTime(-5 - this._numOfTriggers, this._newTime);
        this._updateProgressBar();
    }

    _handleRightRelease() {
        clearInterval(this._speedUpTimer);
        this._speedUpTimer = null;
        this._numOfTriggers = 0;
        if (this._newTime !== null) {
            VideoPlayer.seek(this._newTime);
            this._newTime = null;
        }
    }

    _handleLeftRelease() {
        clearInterval(this._speedUpTimer);
        this._speedUpTimer = null;
        this._numOfTriggers = 0;
        if (this._newTime !== null) {
            VideoPlayer.seek(this._newTime);
            this._newTime = null;
        }
    }
}
