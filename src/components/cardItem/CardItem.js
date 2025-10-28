import { Lightning, Utils } from '@lightningjs/sdk'
import { BRANDING_COLORS } from '../../utils/Colors'

export default class CardItem extends Lightning.Component {
    static _template() {
        return {
            rect: true,
            w: 241,
            h: 359,
            color: BRANDING_COLORS.TRANSPARENT,
            flex: {
                direction: "column",
                paddingRight: 20,
            },
            Image: {
                w: 229,
                h: 300,
                x: 6,
                y: 6,

                alpha: 1,
                shader: {
                    type: Lightning.shaders.RoundedRectangle,
                    radius: 6,
                    stroke: 0,
                    strokeColor: BRANDING_COLORS.TRANSPARENT,
                },
            },
            Label: {
                y: 20,
                x: 6,
                text: {
                    fontSize: 28,
                    textColor: BRANDING_COLORS.LIGHTER_GREY,
                },
            },
        }
    }

    _init() {
        this.tag('Image').on('txLoaded', () => {
            this.tag('Image').setSmooth('alpha', 1)
        })

        this.tag('Image').on('txError', () => {
            this.showPlaceholder()
        })
    }

    set itemData(data) {
        this.tag('Image').src = Utils.asset(data.image)
        this.tag('Label').text.text = data.title
    }

    _focus() {
        this.tag('Image').shader = {
            type: Lightning.shaders.RoundedRectangle,
            radius: 6,
            stroke: 6,
            strokeColor: BRANDING_COLORS.RED,
        }

        this.patch({
            smooth: { scale: 1.05 },
        })

        this.tag('Label').patch({
            text: { textColor: BRANDING_COLORS.WHITE },
        })
    }

    _unfocus() {
        this.tag('Image').shader = {
            type: Lightning.shaders.RoundedRectangle,
            radius: 6,
            stroke: 0,
            strokeColor: BRANDING_COLORS.TRANSPARENT,
        }

        this.patch({
            smooth: { scale: 1.0 },
        })

        this.tag('Label').patch({
            text: { textColor: BRANDING_COLORS.LIGHTER_GREY },
        })
    }


}
