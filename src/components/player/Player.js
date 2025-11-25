import { BRANDING_COLORS } from "../../utils/constants/Colors";
import { VideoPlayer, Lightning, Utils, Router } from "@lightningjs/sdk";
import { loader, unloader } from "./HLS";
import { Align, Direction } from "../../utils/constants/ConstantsForStyle";
import HorizontalContainer from "../horizontalContainer/HorizontalContainer";
import { endVideoIcons, playerIcons } from "../../utils/constants/PlayerIcons";
import PlayerButton from "./components/PlayerButton";
import { formatTime } from "./utils/formatTime";
import ProgressBar from "./components/ProgressBar";
import { PLAYER_ICONS } from "../../utils/constants/URLs";
import LoadingComponent from "../loaderComponent/LoaderComponent";

export default class Player extends Lightning.Component {
    _videoURL = '';
    _currentTime = 0;
    _focusedIconId;
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
                type: ProgressBar,
                props: {

                }
            },

        }
    }

    get _Title() {
        return this.tag('Title')
    }

    get _ProgressBarWraper() {
        return this.tag('ProgressBarWraper')
    }

    get _Controls() {
        return this.tag('ControlsWrapper.Controls')
    }


    set params({ videoURL, title }) {
        VideoPlayer.open(videoURL);
        this._videoURL = videoURL;
        this._currentTime = 0;
        this._focusedIconId = 2;
        this.$updateControlsIcons()
        this.patch({
            Title: {
                text: { text: title }
            },
        });
    }

    $videoPlayerLoadedData() {
        this._videoLoad()
    }



    $videoPlayerTimeUpdate() {
        if (this._isEnd)
            this._showControls();
        this._ProgressBarWraper._updateProgressBar();
    }

    $videoPlayerEnded() {
        this._isEnd = true
    }

    $videoPlayerWaiting() {
        this._showSpinner();
    }

    $videoPlayerCanPlay() {
        this._showControls();
        this._hideSpinner();
    }

    $setIsPaused(status) {
        this._isPaused = status;
    }
    $setIsEnded(status) {
        this._isEnd = status;
        this._ProgressBarWraper._isEnd = status;
    }
    _active() {
        this._setState('ControlsIcons');
    }
    _captureKey({ keyCode }) {
        //lg back 461
        if (this.visible === false && keyCode !== 461) {
            this.visible = true;
            this._showControls();
            return true;
        }
        return false;
    }

    $updateControlsIcons() {
        const actionsPlay = [
            () => this._handleBackFromVideo(),
            () => this._handleBackward(),
            () => this._handleMediaPlayPause(),
            () => this._handleForward(),
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
                        targetIndex: this._focusedIconId,
                        disableScroll: true,
                        onFocusChange: (newIndex) => {
                            this._focusedIconId = newIndex;
                        }
                    }
                }
            },
        });
    }
    _playVideo() {
        if (this._isEnd) return;
        this._isPaused = false;
        VideoPlayer.play();
        this._updatePausePlayIcon(PLAYER_ICONS.PAUSE);

        // VideoPlayer.play();
        // this._isPaused = false
        // this._updatePausePlayIcon(PLAYER_ICONS.PAUSE);
    }

    _pauseVideo() {
        VideoPlayer.pause();
        this._isPaused = true
        this._updatePausePlayIcon(PLAYER_ICONS.PLAY);

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
            Title: { smooth: { alpha: 0, duration: 0, timingFunction: 'ease-in-out' } },
            ControlsWrapper: { smooth: { alpha: 0, duration: 0, timingFunction: 'ease-in-out' } },
            ProgressBarWraper: { smooth: { alpha: 0, duration: 0, timingFunction: 'ease-in-out' } },
            Overlay: { smooth: { alpha: 0, duration: 0, timingFunction: 'ease-in-out' } },
        });

        // this._setState('ControlsIcons');
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
        this._ProgressBarWraper._EndTime.text = formatTime(VideoPlayer.duration);
        this._ProgressBarWraper._currentTime = VideoPlayer.currentTime;
        this._ProgressBarWraper._CurrentTime.text = formatTime(this._currentTime);
    }
    _handleBack() {
        if (this._controlsVisible) {
            this._hideControls();
            this._playVideo();
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


    _handleMediaPlay() {
        this._playVideo();
    }

    _handleMediaPause() {
        this._pauseVideo();
    }

    _handleMediaPlayPause() {
        if (VideoPlayer.playing) {
            this._pauseVideo();
        } else {
            this._playVideo();

        }
        this._showControls();

    }

    _updatePausePlayIcon(icon) {
        setTimeout(() => {
            const btn = this._Controls.Items.children[this._focusedIconId];
            if (btn && btn._Image) {
                btn._Image.patch({
                    texture: lng.Tools.getSvgTexture(Utils.asset(icon), 90, 90)
                });
            }
        }, 0);
    }

    _handleForward() {
        VideoPlayer.skip(5)
        if (!this._isPaused)
            VideoPlayer.play();
    }

    _handleBackward() {
        VideoPlayer.skip(-5)
        if (!this._isPaused)
            VideoPlayer.play();

    }

    _repeatVideo() {
        VideoPlayer.seek(0);
        VideoPlayer.play();
        this._isEnd = false;
        this._isPaused = false;
        // this.$updateControlsIcons();
        // this._showControls();
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
                    return this._ProgressBarWraper;
                }
                _handleUp() {
                    this._setState('ControlsIcons');
                }
                _handleDown() {
                    this._showControls();
                    return false;
                }
            }
        ]
    }
}
