import { Lightning, Router } from '@lightningjs/sdk';
import { Direction, Fonts } from "../../../../utils/constants/ConstantsForStyle";
import { BRANDING_COLORS } from "../../../../utils/constants/Colors";
export default class NavbarItemCard extends Lightning.Component {

    _props = {
        selected: false,
    };

    static _template() {
        return {
            h: 29,
            w: 150,
            flex: { paddingRight: 88, direction: Direction.Column },

            Label: {
                text: {
                    fontFace: Fonts.InterBold,
                    fontSize: 24,
                    letterSpacing: 2
                }
            },

            Line: {
                x: -15,
                y: 10,
                h: 5,
                rect: true,
                color: BRANDING_COLORS.TRANSPARENT,
                shader: {
                    type: Lightning.shaders.RoundedRectangle
                },
                visible: true
            }
        };
    }

    get _Label() {
        return this.tag('Label');
    }

    set props(props) {
        this._props = { ...this._props, ...props };

        const { selected, name } = this._props;

        this.patch({
            Label: {
                text: {
                    text: name,
                    textColor: selected ? BRANDING_COLORS.WHITE : BRANDING_COLORS.GREY
                }
            }
        });

        this.stage.once('frameEnd', () => {
            this.patch({
                Line: { w: this._Label.renderWidth + 25 }
            });
        });
    }

    _focus() {
        this.scale = 1.1;
        this.stage.once('frameEnd', () => {
            this.patch({
                Label: { text: { textColor: BRANDING_COLORS.WHITE } },
                Line: {
                    color: BRANDING_COLORS.RED,
                    w: this._Label.renderWidth + 25
                }
            });
        });
    }

    _unfocus() {
        this.scale = 1.0;
        this.patch({
            Label: {
                text: {
                    textColor: this._props.selected
                        ? BRANDING_COLORS.WHITE
                        : BRANDING_COLORS.GREY
                }
            },
            Line: {
                color: BRANDING_COLORS.TRANSPARENT
            }
        });
    }

    _handleEnter() {
        this._props.indexSelected = this._props.index;
        this.patch({
            Label: {
                text: {
                    textColor:
                        this._props.indexSelected === this._props.index
                            ? BRANDING_COLORS.WHITE
                            : BRANDING_COLORS.GREY
                }
            }
        });

        this.fireAncestors('$storeSelectedIndex', 0);

        this.fireAncestors('$changePage', this._props.index);

    }

    _handleDown() {
        return false;
    }
}
