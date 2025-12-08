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
    _isEnd = false;
    _isPaused = false;
    static _template() {
        return {
            CurrentTime: {
                w: 119,
                h: 31,
                rect: true,
                color: BRANDING_COLORS.WHITE,
                text: { text: "00:00", fontFace: Fonts.InterBold, fontSize: 26, textColor: BRANDING_COLORS.WHITE, letterSpacing: 1 }
            },
            ProgressBar: {
                collision: true,
                w: 1404,
                h: 13,
                BackgroundBar: {},
                Progress: {
                    rect: true,
                    w: 0,
                    flex: { alignItems: Align.Center },
                    h: h => h,
                    color: BRANDING_COLORS.RED,
                    Marker: {
                        visible: false,
                        texture: lng.Tools.getRoundRect(24, 24, 12, 3, BRANDING_COLORS.WHITE, true, BRANDING_COLORS.RED)
                    }
                }
            },
            EndTime: {
                w: 119,
                h: 31,
                text: {
                    text: "00:00",
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
            w - 2,
            h + 1,
            radius,
            strokeWidth,
            strokeColor,
            BRANDING_COLORS.GREY
        );
    }

    _progress(p) {
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
        if (Math.floor(time) === Math.floor(VideoPlayer.duration)) {
            if (!this._isEnd) {
                this.fireAncestors("$videoIsEnded")
            }
        }
        else {
            if (this._isEnd) {
                this.fireAncestors("$setIsEnded", false);
                this.fireAncestors("$updateControlsIcons");
                this.fireAncestors("$playPauseVideo")
            }
        }

        if (time / VideoPlayer.duration > 0)
            this._progress(time / VideoPlayer.duration);
    }

    _handleRight() {
        this._skipVideoForwardBack(false)
    }

    _handleLeft() {
        this._skipVideoForwardBack(true)
    }

    _skipVideoForwardBack(back) {
        const newDirection = back ? "left" : "right";

        if (this._direction !== newDirection) {
            this._direction = newDirection;
            this._numOfTriggers = 0;
        }

        if (!this._speedUpTimer) {
            this._speedUpTimer = setInterval(() => {
                if (this._numOfTriggers < 25)
                    this._numOfTriggers += 5;
            }, 500);
        }

        if (this._newTime == null)
            this._newTime = VideoPlayer.currentTime;

        const base = back ? -5 : 5;
        const delta = back ? base - this._numOfTriggers : base + this._numOfTriggers;

        this._newTime = computeSeekTime(delta, this._newTime);
        this.fireAncestors("$showControls");
    }

    _handleRightRelease() {
        this._resetVideo();
    }

    _handleLeftRelease() {
        this._resetVideo();
    }

    _resetVideo() {
        clearInterval(this._speedUpTimer);
        this._speedUpTimer = null;
        this._numOfTriggers = 0;
        if (this._newTime !== null) {
            VideoPlayer.seek(this._newTime);
            this._newTime = null;
        }
    }

    _handleHover() {
        this.fireAncestors("$showControls")
        this.fireAncestors("$handleHoverState", this.ref);
    }
}
