import { Lightning } from '@lightningjs/sdk';
import { Fonts } from "../../../../utils/constants/ConstantsForStyle";
import { BRANDING_COLORS } from "../../../../utils/constants/Colors";

export default class NavbarItemCard extends Lightning.Component {

    _props = {
        selected: false,
    };

    static _template() {
        return {
            h: 29,
            flex: { paddingRight: 88 },
            Label: {
                zIndex: 400,
                text: {
                    fontFace: Fonts.InterBold,
                    fontSize: 24,
                    textColor: BRANDING_COLORS.GREY,
                    letterSpacing: 2
                }
            }
        };
    }


    get _Label() {
        return this.tag('Label');
    }

    set props(props) {
        this._props = { ...this._props, ...props };
        const { selected, name } = this._props;
        this._Label.patch({ text: { text: name } });
        if (selected) {
            this._Label.patch({ text: { textColor: BRANDING_COLORS.RED } });
        }
        else {
            this._Label.patch({ text: { textColor: BRANDING_COLORS.GREY } });
        }
    }

    getSelectedIndex() {
        if (this._props.selected) {
            return this._props.index;

        }
        return -1
    }

    _focus() {
        this._Label.patch({
            scale: 1.1,
            text: { textColor: BRANDING_COLORS.RED }
        });

    }

    _unfocus() {
        this._Label.patch({
            scale: 1.0,
            text: { textColor: BRANDING_COLORS.GREY }
        });
    }
    _getFocused() {
        return this;
    }
    _handleEnter() {

    }
    _handleDown() {
        return false;
    }
}
