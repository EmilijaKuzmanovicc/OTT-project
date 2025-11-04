import { Lightning, Utils } from '@lightningjs/sdk'
import { BRANDING_COLORS } from '../../utils/constants/Colors'
import { Direction } from '../../utils/constants/ConstantsForStyle';

export default class CardItem extends Lightning.Component {
    static _template() {
        return {
            rect: true,
            y: 5,
            x: -6,
            color: BRANDING_COLORS.TRANSPARENT,
            flex: { direction: Direction.Column, paddingRight: 20 },
            Image: {
                w: w => w - 26,
                h: h => h - 59,
                x: 6,
                y: 6,
                alpha: 1,
                shader: {
                    type: Lightning.shaders.RoundedRectangle,
                    radius: 6,
                    stroke: 0,
                    strokeColor: BRANDING_COLORS.RED,
                },
            },
            Label: {
                y: 16,
                x: 6,
                text: {
                    fontSize: 28,
                    textColor: BRANDING_COLORS.LIGHTER_GREY,
                },
            },
        }
    }

    get _Image() {
        return this.tag("Image")
    }

    get _Label() {
        return this.tag("Label");
    }

    set itemData(data) {
        this.tag('Image').src = Utils.asset(data.image)
        this.tag('Label').text.text = data.title
    }

    _focus() {
        this.patch({
            smooth: { scale: 1.05 },
            Image: { shader: { stroke: 6 }, },
            Label: { text: { textColor: BRANDING_COLORS.WHITE } }
        })
    }

    _unfocus() {
        this.patch({
            smooth: { scale: 1.0 },
            Image: { shader: { stroke: 0 } },
            Label: { text: { textColor: BRANDING_COLORS.LIGHTER_GREY } }
        })
    }

}
