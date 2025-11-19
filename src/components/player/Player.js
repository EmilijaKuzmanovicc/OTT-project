import { BRANDING_COLORS } from "../../utils/constants/Colors";
import { VideoPlayer, Lightning, Utils } from "@lightningjs/sdk";
import { loader, unloader } from "./HLS";
import { Align, Direction, Fonts } from "../../utils/constants/ConstantsForStyle";
import HorizontalContainer from "../horizontalContainer/HorizontalContainer";
import { playerIcons } from "../../utils/constants/PlayerIcons";
import PlayerButton from "./components/PlayerButton";
import { FormatTime } from "./utils/FormatTime";
import ProgressBar from "./components/ProgressBar";

export default class Player extends Lightning.Component {
    _duration
    _videoURL
    _currentTime

    static _template() {
        return {
            x: 0,
            y: 0,
            w: 1920,
            h: 1080,
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
                x: 121,
                y: 830,
                w: 1690,
                h: 100,
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
                        // text: "00:00",
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
    get _CurrentTime() {
        return this.tag('ProgressBarWraper.CurrentTime')
    }
    get _ProgressBar() {
        return this.tag('ProgressBarWraper.ProgressBar')
    }
    get _EndTime() {
        return this.tag('ProgressBarWraper.EndTime')
    }

    get _ControlsWrapper() {
        return this.tag('ControlsWrapper.Controls')
    }
    set params({ videoURL, title }) {
        this._videoURL = videoURL;
        console.log("propssssssss", this._duration);
        this._currentTime = 0;
        this.patch({
            Title: {
                text: { text: title }
            },
            ControlsWrapper: {
                Controls: {
                    props: {
                        items: playerIcons.map((item) => ({
                            type: PlayerButton,
                            props: {
                                image: item.image,
                                x: item.x,
                                r: item.r,
                                visible: item.visible
                            }
                        })),
                        targetIndex: this._indexSelected,
                        disableScroll: true,
                    }
                }
            },
        });


    }
    set props(props) {
        this._props = props;
        console.log(this._props, "proooo");
    }
    _active() {
        this._setState('ControlsIcons');
    }

    _enable() {

        this.fireAncestors('$punchHole');
        VideoPlayer.position(0, 0);
        VideoPlayer.size(1920, 1080);
        VideoPlayer.consumer(this);
        VideoPlayer.open(this._videoURL);
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

    $videoPlayerLoadedData() {
        this._videoLoad()
        this._updateProgressBar()
    }

    _updateProgressBar() {
        this._currentTime = VideoPlayer.currentTime;
        this._CurrentTime.text = FormatTime(this._currentTime);

        if (this._duration > 0) {
            const progress = this._currentTime / this._duration;
            console.log("progress", progress);
            this._ProgressBar.progress(0.3);
        }
    }


    static _states() {
        return [
            class ControlsIcons extends this {
                _getFocused() {
                    return this._ControlsWrapper;
                }

                _handleDown() {
                    this._setState('ProgressBarState');
                }
                _handleUp() {
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
                    return false;
                }
            }

        ]
    }

}
