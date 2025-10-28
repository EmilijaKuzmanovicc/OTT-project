import { Lightning } from '@lightningjs/sdk';
import { BRANDING_COLORS } from '../../utils/Colors';

export default class VerticalItem extends Lightning.Component {
    static _template() {
        return {
            w: 250,
            h: 142,
            rect: true,
            color: BRANDING_COLORS.LIGHTER_BLACK,
            shader: { type: Lightning.shaders.RoundedRectangle, radius: 12 },
            flexItem: { marginTop: 10 },
            ImageWrapper: {
                w: 160,
                h: 60,
                mount: 0.5,
                x: 125,
                y: 71,
                Image: {
                    w: 160,
                    h: 60,
                    shader: { type: Lightning.shaders.RoundedRectangle, radius: 12 },
                    visible: false,
                },
            },
            Text: {
                mount: 0.5,
                x: 100,
                y: 50,
                text: {
                    text: '',
                    fontSize: 36,
                    fontFace: 'Regular',
                    textColor: BRANDING_COLORS.WHITE,
                    textAlign: 'center',
                },
                visible: false,
            },
        };
    }

    set itemData(data) {
        if (data.image) {
            this.tag('Image').patch({ src: data.image, visible: true });
            this.tag('Text').patch({ visible: false });
        } else if (data.title) {
            this.tag('Text').patch({ text: { text: data.title }, visible: true });
            this.tag('Image').patch({ visible: false });
        }
    }

    _focus() {
        this.patch({
            smooth: {
                scale: 1.1,
                zIndex: 1,
            },
            color: BRANDING_COLORS.BACK_BUTTON,
        });
    }

    _unfocus() {
        this.patch({
            smooth: {
                scale: 1.0,
                zIndex: 0,
            },
            color: BRANDING_COLORS.LIGHT_BLACK,
        });
    }
}