import { BRANDING_COLORS } from "../../utils/constants/Colors";
import { VideoPlayer, Lightning, Utils, Router } from "@lightningjs/sdk";
import { loader, unloader } from "./HLS";
import { Align, Direction, Fonts } from "../../utils/constants/ConstantsForStyle";
import HorizontalContainer from "../horizontalContainer/HorizontalContainer";
import { endVideoIcons, playerIcons } from "../../utils/constants/PlayerIcons";
import PlayerButton from "./components/PlayerButton";
import { FormatTime } from "./utils/FormatTime";
import ProgressBar from "./components/ProgressBar";
import { PLAYER_ICONS } from "../../utils/constants/URLs";
import LoadingComponent from "../loaderComponent/LoaderComponent";

export default class Player extends Lightning.Component {
    _duration = 0;
    _videoURL = '';
    _currentTime = 0;
    _pausedIconId = 2;
    _controlsTimeout = null;
    _controlsVisible = true;
    _isEnd = false;
    _isPaused = false;
    static _template() {
        return {
            x: 0,
            y: 0,
            w: 1920,
            h: 1080,
            Spinner: {
                visible: true,
                type: LoadingComponent,

                color: BRANDING_COLORS.LIGHTER_BLACK,
                props: {
                    xPos: 960,
                    yPos: 540,
                },
            },
            Overlay: { zIndex: 2, x: 0, y: 0, w: 1920, h: 1080, rect: true, color: BRANDING_COLORS.LIGHT_BLACK, alpha: 0 },
            Title: {
                visible: true,
                x: 40,
                y: 25,
                zIndex: 3,
                text: {
                    fontSize: 28,
                    textColor: BRANDING_COLORS.WHITE,
                }
            },
            ControlsWrapper: {
                visible: true,
                x: 121,
                y: 830,
                w: 500,
                h: 100,
                zIndex: 3,
                flex: {
                    direction: Direction.Row,
                    alignItems: Align.Center,
                },
                Controls: {
                    type: HorizontalContainer
                }
            },
            ProgressBarWraper: {
                x: 115,
                y: 961,
                w: 1690,
                h: 31,
                zIndex: 3,
                flex: {
                    direction: Direction.Row,
                    alignItems: Align.Center,
                    justifyContent: Align.SpaceBetween,
                    gap: 45
                },
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
                    type: ProgressBar,
                    props: {

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
            },

        }
    }

    get _Title() {
        return this.tag('Title')
    }
    get _CurrentTime() {
        return this.tag('ProgressBarWraper.CurrentTime')
    }
    get _ProgressBar() {
        return this.tag('ProgressBarWraper.ProgressBar')
    }
    get _EndTime() {
        return this.tag('ProgressBarWraper.EndTime')
    }

    get _Controls() {
        return this.tag('ControlsWrapper.Controls')
    }

    _captureKey() {
        if (this.visible === false) {
            this.visible = true;
            this._showControls();
            return true;
        }
        this._showControls();
        return false;
    }

    set params({ videoURL, title }) {
        VideoPlayer.open(videoURL);
        this._videoURL = videoURL;
        this._currentTime = 0;
        this._pausedIconId = 2;
        this._updateControlsIcons()
        this.patch({
            Title: {
                text: { text: title }
            },
        });
    }

    _updateControlsIcons() {
        const actionsPlay = [
            () => this._handleBackFromVideo(),
            () => this._skipVideo(false),
            () => this._handleMediaPlayPause(),
            () => this._skipVideo(true)
        ];
        const actionsEnd = [
            () => this._handleBackFromVideo(),
            () => this._repeatVideo(true)
        ];

        this.patch({
            ControlsWrapper: {
                visible: true,
                x: this._isEnd ? 880 : 121,
                y: this._isEnd ? 500 : 830,
                Controls: {
                    props: {
                        items: (this._isEnd ? endVideoIcons : playerIcons).map((item, index) => ({
                            type: PlayerButton,
                            props: {
                                image: item.label === "PLAY_PAUSE" ? (this._isPaused ? PLAYER_ICONS.PLAY : PLAYER_ICONS.PAUSE) : item.image,
                                x: item.x,
                                r: item.r,
                                visible: item.visible,
                                onEnter: this._isEnd ? actionsEnd[index] : actionsPlay[index]
                            }
                        })),
                        targetIndex: this._pausedIconId,
                        disableScroll: true,
                    }
                }
            },
        });
    }
    _active() {
        this._setState('ControlsIcons');
    }

    $videoPlayerCanPlay() {
        this._showControls();
        this._hideSpinner();
    }

    _hideSpinner() {
        this.patch({
            Spinner: {
                visible: false
            }
        })
    }
    _showSpinner() {
        this.patch({
            Spinner: {
                visible: true
            }
        })
    }

    $videoPlayerWaiting() {
        this._showSpinner();
    }

    _showControls() {
        clearTimeout(this._controlsTimeout);
        this._controlsVisible = true;

        this.patch({
            Title: { smooth: { alpha: 1, duration: 5 } },
            ControlsWrapper: { smooth: { alpha: 1, duration: 5 } },
            ProgressBarWraper: { smooth: { alpha: 1, duration: 5 } },
            Overlay: { smooth: { alpha: 0.3, duration: 5 } },
        });

        if (this._isPaused || this._isEnd) return;
        this._controlsTimeout = setTimeout(() => {
            this._hideControls();
        }, 5000);
    }

    _hideControls() {
        this._controlsVisible = false;

        this.patch({
            Title: { smooth: { alpha: 0, duration: 5, timingFunction: 'ease-in-out' } },
            ControlsWrapper: { smooth: { alpha: 0, duration: 5, timingFunction: 'ease-in-out' } },
            ProgressBarWraper: { smooth: { alpha: 0, duration: 5, timingFunction: 'ease-in-out' } },
            Overlay: { smooth: { alpha: 0, duration: 5, timingFunction: 'ease-in-out' } },
        });
    }


    _enable() {
        this.fireAncestors('$punchHole');
        VideoPlayer.position(0, 0);
        VideoPlayer.size(1920, 1080);
        VideoPlayer.consumer(this);
        VideoPlayer.loader(loader);
        VideoPlayer.unloader(unloader);
        VideoPlayer.loop(false);
    }

    _disable() {
        this.fireAncestors('$unpunchHole');
        VideoPlayer.clear();
    }

    _videoLoad() {
        this._duration = VideoPlayer.duration;
        this._EndTime.text = FormatTime(this._duration);
        this._currentTime = VideoPlayer.currentTime;
        this._CurrentTime.text = FormatTime(this._currentTime);
    }
    _handleBack() {
        if (this._controlsVisible) {
            this._hideControls();
            this.$playVideo();
        } else {
            this._handleBackFromVideo()
        }
    }

    _handleBackFromVideo() {
        if (Router.isNavigating()) {
            return;
        }
        const routerHistory = Router.getHistory().filter(
            history => history.hash !== 'splash' && history.hash !== 'cmp'
        );

        if (routerHistory.length) {
            Router.back();
        } else {
            Router.navigate('detailpage');
        }
    }
    $videoPlayerLoadedData() {
        this._videoLoad()
    }
    $videoPlayerTimeUpdate() {
        this._updateProgressBar();
    }
    _updateProgressBar() {
        this._currentTime = VideoPlayer.currentTime;
        this._CurrentTime.text = FormatTime(this._currentTime);

        const wasEnd = this._isEnd;
        this._isEnd = Math.floor(this._currentTime) === Math.floor(this._duration);

        if (wasEnd !== this._isEnd)
            this._updateControlsIcons();
        if (this._isEnd)
            if (!wasEnd)
                this._showControls();
        if (this._duration > 0) {
            this._ProgressBar.progress(this._currentTime / this._duration);
        }
    }

    $playVideo() {
        VideoPlayer.play();
        this._isPaused = false
        this._updatePausePlayIcon(PLAYER_ICONS.PAUSE);
    }

    $pauseVideo() {
        VideoPlayer.pause();
        this._isPaused = true
        this._updatePausePlayIcon(PLAYER_ICONS.PLAY);

    }

    _handleMediaPlay() {
        this.$playVideo();
    }

    _handleMediaPause() {
        this.$pauseVideo();
    }

    _handleMediaPlayPause() {
        if (VideoPlayer.playing) {
            this.$pauseVideo();
        } else {
            this.$playVideo();

        }
        this._showControls();

    }

    _updatePausePlayIcon(icon) {
        setTimeout(() => {
            const btn = this._Controls.Items.children[this._pausedIconId];
            if (btn && btn._Image) {
                btn._Image.patch({
                    texture: lng.Tools.getSvgTexture(Utils.asset(icon), 90, 90)
                });
            }
        }, 0);
    }

    _handleForward() {
        this._skipVideo(true);
        if (!this._isPaused)
            VideoPlayer.play();
    }

    _handleBackward() {
        this._skipVideo(false);
        if (!this._isPaused)
            VideoPlayer.play();

    }

    _repeatVideo() {
        VideoPlayer.seek(0);
        VideoPlayer.play();
        this._isEnd = false;
        this._isPaused = false;
        this._updateControlsIcons();
        this._showControls();
    }

    _skipVideo(forward) {
        const skipAmount = 5;
        const currentTime = VideoPlayer.currentTime;
        const duration = VideoPlayer.duration;
        let newTime = forward ? currentTime + skipAmount : currentTime - skipAmount;
        if (newTime < 0) newTime = 0;
        if (newTime > duration) newTime = duration;
        VideoPlayer.seek(newTime);
    }

    static _states() {
        return [
            class ControlsIcons extends this {
                _getFocused() {
                    return this._Controls;
                }
                _handleDown() {
                    this._setState('ProgressBarState');
                }
                _handleUp() {
                    this._showControls();
                    return false
                }
            },
            class ProgressBarState extends this {
                _getFocused() {
                    return this._ProgressBar;
                }
                _handleUp() {
                    this._setState('ControlsIcons');
                }
                _handleDown() {
                    this._showControls();
                    return false;
                }
                _handleLeft() {
                    this._handleBackward()
                }
                _handleRight() {
                    this._handleForward()
                }
            }
        ]
    }
}
