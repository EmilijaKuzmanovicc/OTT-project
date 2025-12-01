import { Router, Lightning, Utils } from "@lightningjs/sdk";
import { BRANDING_COLORS } from "../../utils/constants/Colors";
import CardItem from "../cardItem/CardItem";
import HorizontalContainer from "../horizontalContainer/HorizontalContainer";
import { Fonts } from "../../utils/constants/ConstantsForStyle";
import { VOD_TYPES } from "../../utils/constants/Constants";
import { URLS_VITE } from "../../utils/constants/env";
import { IMAGES_URL } from "../../utils/constants/URLs";
export default class VodPreview extends Lightning.Component {
    _props = {};
    _indexSelected = 0;

    static _template() {
        return {
            w: 1920,
            Background: { w: 1920, h: 1080 },
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
                    y: 80,
                    w: 698,
                    text: {
                        FontFace: Fonts.SemiBold,
                        letterSpacing: 2,
                        fontSize: 22,
                        color: BRANDING_COLORS.WHITE,
                        maxLines: 10,
                        maxLinesSuffix: "...",
                    }
                },
            },
            VodContainer: {
                signals: { changeHeroBackground: true },
                y: 670,
                x: 35,
                h: 370,
                Column: {
                    collision: true,
                    w: 1860,
                    type: HorizontalContainer,
                }
            },
        };
    }

    get _Background() { return this.tag('Background'); }
    get _VodContainer() { return this.tag('VodContainer'); }
    get _Column() { return this.tag('VodContainer.Column'); }
    get _Content() { return this.tag('Content'); }
    get _Overview() { return this.tag('Content.Overview'); }

    _animateText() {
        if (this._textAnim) this._textAnim.stop();

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

        const selectedItem = data[this._indexSelected];

        const selectedName = vodType === VOD_TYPES.MOVIES ? selectedItem.title : selectedItem.name;
        const imageUrl = selectedItem.backdrop_path
            ? `${URLS_VITE.VITE_TMDB_IMAGE_URL_POSTER}${selectedItem.backdrop_path}`
            : Utils.asset(IMAGES_URL.IMAGE_NOT_FOUND);

        this.patch({
            Background: { src: imageUrl },
            Content: {
                text: selectedName,
                Overview: { text: selectedItem.overview }
            },
            VodContainer: {
                Column: {
                    props: {
                        items: data.map((item, i) => ({
                            w: 460,
                            h: 330,
                            type: CardItem,
                            props: { ...item, railType: vodType, index: i },
                            passSignals: { changeHeroBackground: true }
                        })),
                        targetIndex: this._indexSelected,
                        disableScroll: false,
                        paddingLeft: 20
                    }
                }
            }
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

    _getFocused() { return this.tag('Column'); }

    _handleUp() {
        Router.focusWidget('Menu');
        return true;
    }

    changeHeroBackground(name, overview, src) {
        this._animateText();

        this.patch({
            Background: { src },
            Content: {
                text: { text: name },
                Overview: { text: overview }
            }
        });
    }

    $storeSelectedIndex(index) {
        this._indexSelected = index;
    }

    _handleBack(e) {
        if (Router.isNavigating()) return;

        e.preventDefault();
        const routerHistory = Router.getHistory().filter(
            history => history.hash !== 'splash' && history.hash !== 'cmp'
        );

        if (routerHistory.length) {
            Router.back();
        } else {
            Router.navigate('home');
        }
    }
}
