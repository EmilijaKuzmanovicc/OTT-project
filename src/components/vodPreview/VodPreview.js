import { Router, Lightning, Utils } from "@lightningjs/sdk";
import { BRANDING_COLORS } from "../../utils/constants/Colors";
import CardItem from "../cardItem/CardItem";
import HorizontalContainer from "../horizontalContainer/HorizontalContainer";
import { Fonts } from "../../utils/constants/ConstantsForStyle";
import { IMAGES_URL } from "../../utils/constants/URLs";

export default class VodPreview extends Lightning.Component {
    _props = {};
    _indexSelected = 0;

    static _template() {
        return {
            w: 1920,
            Background: {
                w: 1920,
                h: 1080,
            },
            Layout: {
                rect: true,
                x: 0,
                y: 0,
                w: 1920,
                h: 1080,
                color: BRANDING_COLORS.BLACK_TRANSPARENT,
            },
            Content: {
                x: 125,
                y: 250,
                w: 700,
                h: 370,
                text: {
                    letterSpacing: 2,
                    FontFace: Fonts.SemiBold,
                    fontSize: 28,
                    color: BRANDING_COLORS.WHITE
                },
                Overview: {
                    y: 60,
                    w: 698,
                    text: {
                        FontFace: Fonts.SemiBold,
                        letterSpacing: 2,
                        fontSize: 22,
                        color: BRANDING_COLORS.WHITE
                    }
                },
            },

            VodContainer: {
                y: 670,
                x: 20,
                h: 370,
                w: 1920,
                Column: {
                    w: 1880,
                    type: HorizontalContainer,

                }
            },

        };
    }

    get _VodContainer() {
        return this.tag('VodContainer');
    }

    get _Column() {
        return this.tag('VodContainer.Column');
    }
    get _Content() {
        return this.tag('Content');
    }
    get _Overview() {
        return this.tag('Content.Overview');
    }


    _animateText() {

        if (this._textAnim) {
            this._textAnim.stop();
        }


        this._textAnim = this._Content.animation({
            duration: 3,
            repeat: -1,
            stopMethod: 'immediate',
            actions: [
                { p: 'alpha', v: { 0: 0, 0.3: 1, 0.7: 1, 1: 0 } }
            ]
        });

        this._textAnim.start();
    }

    set props(props) {
        const { vodType, data } = props;
        this._props = props;
        this._Column.patch({
            props: {
                items: data.map((item, i) => ({
                    w: 460,
                    h: 330,
                    type: CardItem,
                    props: { ...item, railType: vodType },
                })),
                targetIndex: this._indexSelected,
                disableScroll: false,

                paddingLeft: 20
            }
        });
        this.patch({
            signals: {
                onCardFocus: true,
            }
        });

        this._Content.patch({
            text: vodType.charAt(0).toUpperCase() + vodType.slice(1)
        });
    }

    static _states() {
        return [
            class VodContainer extends this {
                _handleUp() {
                    Router.focusWidget("Menu");
                    return true;
                }
            }
        ];
    }

    _getFocused() {
        return this.tag('Column');
    }

    _handleUp() {
        Router.focusWidget('Menu');
        return true;
    }
    $onCardFocus(name, overview, src) {
        this._animateText();
        this.patch({
            Background: { src: src },

            Content: {
                text: { text: name },
                Overview: {
                    text: overview
                }

            },
        });
    }
    onItemChange(src) {
        this.patch({
            Background: { src: src },
        });
    }
}
