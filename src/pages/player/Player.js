import Lightning from "@lightningjs/sdk/src/Lightning";
import { BRANDING_COLORS } from "../../utils/constants/Colors";
import LoadingComponent from "../../components/loaderComponent/LoaderComponent";
import { Align, Direction } from "../../utils/constants/ConstantsForStyle";
import HorizontalContainer from "../../components/horizontalContainer/HorizontalContainer";
import { Router, Utils, VideoPlayer } from "@lightningjs/sdk";
import { loader, unloader } from "./hls/HLS";
import { endVideoIcons, playerIcons } from "../../utils/constants/PlayerIcons";
import { PLAYER_ICONS } from "../../utils/constants/URLs";
import PlayerButton from "./components/PlayerButton";
import { formatTime } from "./utils/formatTime";
import ProgressBar from "./components/ProgressBar";


export default class Player extends Lightning.Component {
    _videoURL = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
    _currentTime = 0;
    _focusedIconId = 2;
    _controlsTimeout = null;
    _controlsVisible = true;
    _isEnd = false;
    _isPaused = false;
    _progressBarTimer = null;
    static _template() {
        return {
            x: 0,
            y: 0,
            w: 1920,
            h: 1080,
            collision: true,
            Overlay: {

                x: 0, y: 0, w: 1920, h: 1080, rect: true, color: BRANDING_COLORS.LIGHT_BLACK, alpha: 0
            },
            Spinner: {
                visible: true,
                type: LoadingComponent,
                color: BRANDING_COLORS.LIGHTER_BLACK,
                props: {
                    xPos: 960,
                    yPos: 540,
                },
            },

            Title: {
                visible: true,
                x: 40,
                y: 25,

                text: {
                    fontSize: 28,
                    textColor: BRANDING_COLORS.WHITE,
                }
            },
            ControlsWrapper: {
                visible: true,
                collision: true,
                x: 121,
                y: 830,
                w: 500,
                h: 100,
                flex: {
                    direction: Direction.Row,
                    alignItems: Align.Center,
                },
                Controls: {
                    collision: true,
                    type: HorizontalContainer
                }
            },
            ProgressBarWraper: {
                x: 115,
                y: 961,
                w: 1690,
                h: 31,
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

    get _Title() { return this.tag('Title') }

    get _ProgressBarWraper() { return this.tag('ProgressBarWraper') }

    get _Controls() { return this.tag('ControlsWrapper.Controls') }

    set params({ videoURL, title }) {
        VideoPlayer.open(videoURL);
        this._videoURL = videoURL;

        // this._focusedIconId = this._isEnd ? 1 : 2;

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

    $videoPlayerEnded() {
        this._ProgressBarWraper._resetVideo();
        this.$showControls();
    }

    $videoIsEnded() {
        this.$setIsEnded(true);
        this.$updateControlsIcons();
        this.$showControls();

        const current = this._getState();



        if (current === "Controls")
            this._setState("ProgressBarWraper")

        this._setState("Controls");
        // this._setState("ProgressBarWraper");

        // if (this._getState() !== "Controls")
        //     this._setState("Controls");

        this._ProgressBarWraper._resetVideo();


    }
    $defaultFocus() {
        this._setState("Controls")
    }

    $videoPlayerWaiting() {
        clearInterval(this._progressBarTimer);
        this._progressBarTimer = null;

        this._showSpinner();
    }

    $videoPlayerCanPlay() {
        this.$showControls();
        this._hideSpinner();
    }

    $setIsPaused(status) {
        this._isPaused = status;
        this._ProgressBarWraper._isPaused = status;
    }

    $setIsEnded(status) {
        this._isEnd = status;
        this._ProgressBarWraper._isEnd = status;
    }

    $horizontalContainerIndexChange() {
        this.$showControls();
    }

    $updateControlsIcons() {
        const actionsPlay = [
            () => this._handleBackFromVideo(),
            () => this._handleBackward(),
            () => this.$handleMediaPlayPause(),
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

    $playVideo() {
        if (this._isEnd) return;

        VideoPlayer.play();
        this.$setIsPaused(false)
        this._updatePausePlayIcon(PLAYER_ICONS.PAUSE);
    }

    $pauseVideo() {
        if (this._isEnd) return;
        VideoPlayer.pause();
        this.$setIsPaused(true)
        this._updatePausePlayIcon(PLAYER_ICONS.PLAY);

    }

    $showControls() {
        clearTimeout(this._controlsTimeout);
        this.patch({
            Overlay: { smooth: { alpha: 0.3, duration: 5 } },
            Title: { smooth: { alpha: 1, duration: 5 } },
            ControlsWrapper: { smooth: { alpha: 1, duration: 5 } },
            ProgressBarWraper: { smooth: { alpha: 1, duration: 5 } },

        });
        this._controlsVisible = true;
        //}
        this._ProgressBarWraper._updateProgressBar();
        if (this._isPaused || this._isEnd) return;

        if (!this._isPaused && !this._isEnd && VideoPlayer.playing) {
            if (!this._progressBarTimer) {
                this._progressBarTimer = setInterval(() => {
                    this._ProgressBarWraper._updateProgressBar();
                }, 1000);
            }
        }

        if (!this._isPaused && !this._isEnd)
            this._controlsTimeout = setTimeout(() => {
                //   this._controlsTimeout = null;
                this._hideControls();
            }, 5000);


    }

    _hideControls() {
        if (this._isEnd)
            return;


        clearInterval(this._progressBarTimer)
        this._progressBarTimer = null;
        this._controlsVisible = false;
        this.patch({
            Overlay: { smooth: { alpha: 0, duration: 0, timingFunction: 'ease-in-out' } },
            Title: { smooth: { alpha: 0, duration: 0, timingFunction: 'ease-in-out' } },
            ControlsWrapper: { smooth: { alpha: 0, duration: 0, timingFunction: 'ease-in-out' } },
            ProgressBarWraper: { smooth: { alpha: 0, duration: 0, timingFunction: 'ease-in-out' } },
        });
    }

    _active() {
        this._setState('Controls');
    }

    _captureKey({ keyCode }) {
        if (this.visible === false && window.keyCode[keyCode] === 'Back') {
            this.visible = true;
            this.$showControls();
            return true;
        }
        return false;
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

    _enable() {
        this._currentTime = 0;
        this._isEnd = false;
        this._isPaused = false;
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
            if (this._isEnd)
                this._handleBackFromVideo()
            else {
                this._hideControls();
                this.$playVideo();
            }

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
        this.$playVideo();
    }

    _handleMediaPause() {
        this.$pauseVideo();
    }

    _init() {
        window.addEventListener('mousemove', () => {
            if (this._controlsVisible === false) {
                this._controlsVisible = true;
                this.$showControls();
            }
        });
    }

    $handleHoverState(ref) {

        const currentState = this._getState();
        if (ref !== currentState) {
            if (currentState) this.tag(currentState)._unfocus();
            this._setState(ref);
        }
    }

    _handleHover() {
        this.fireAncestors("$handleHoverState", this.ref);
    }

    $handleMediaPlayPause() {
        if (!this._isPaused)
            this.$pauseVideo();
        else
            this.$playVideo();
        this.$showControls();

    }

    _updatePausePlayIcon(icon) {
        const btn = this._Controls.Items.children[this._focusedIconId];
        if (btn && btn._Image) {
            btn._Image.patch({
                texture: lng.Tools.getSvgTexture(Utils.asset(icon), 90, 90)
            });
        }
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

        this.$setIsEnded(false);
        this.$setIsPaused(false);
        this._focusedIconId = 2;

        this._ProgressBarWraper._newTime = null;
        this._ProgressBarWraper._isEnd = false;

        this.$updateControlsIcons();
        this.$showControls();
    }

    static _states() {
        return [
            class Controls extends this {
                _getFocused() {
                    return this._Controls;
                }
                _handleDown() {
                    this.$showControls();
                    this._setState('ProgressBarWraper');
                }
                _handleUp() {
                    this.$showControls();
                    return false
                }
            },
            class ProgressBarWraper extends this {
                _getFocused() {
                    return this._ProgressBarWraper;
                }
                _handleUp() {
                    this.$showControls();
                    this._setState('Controls');
                    return false
                }
                _handleDown() {
                    this.$showControls();
                    return false;
                }
            }
        ]
    }
}
