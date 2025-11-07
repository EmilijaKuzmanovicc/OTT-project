import Lightning from "@lightningjs/sdk/src/Lightning";
import { Direction, Fonts } from "../../../utils/constants/ConstantsForStyle";
import { BRANDING_COLORS } from "../../../utils/constants/Colors";
import { splitTextInTwoLines } from "../utils/splitTextInTwoLines";

export default class PropertyRow extends Lightning.Component {
    static _template() {
        return {
            w: 698,
            flex: { direction: "column", spacing: 0, paddingTop: 5 },
            Text: {
                flex: { direction: "row" },
                Label: {
                    text: {
                        fontFace: Fonts.ExtraBold,
                        fontSize: 22,
                        textColor: BRANDING_COLORS.WHITE
                    }
                },
                Elements: {
                    text: {
                        lineHeight: 22,
                        fontFace: Fonts.Regular,
                        fontSize: 22,
                        textColor: BRANDING_COLORS.WHITE,
                    }
                }
            },
            NewLine: {
                text: {
                    lineHeight: 22,
                    fontFace: Fonts.Regular,
                    fontSize: 22,
                    textColor: BRANDING_COLORS.WHITE,
                }
            }
        }
    }

    get _Label() {
        return this.tag('Text.Label')
    }
    get _Elements() {
        return this.tag('Text.Elements')
    }

    set props(props) {
        this._props = { ...this._props, ...props };
        const { label, elements } = this._props;
        const { firstLine, secondLine } = splitTextInTwoLines(elements, this._w / 12)

        this.patch({
            Text: {
                Label: { text: label + ': ' },
                Elements: { text: firstLine }
            },
            NewLine: { text: secondLine }
        });
    }
}
