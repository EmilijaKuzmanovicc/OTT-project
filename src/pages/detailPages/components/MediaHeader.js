import Lightning from "@lightningjs/sdk/src/Lightning";
import { Direction, Fonts } from "../../../utils/constants/ConstantsForStyle";
import { BRANDING_COLORS } from "../../../utils/constants/Colors";
import { joinWords } from "../utils/joinWords";

const fields = ['Genres', 'DateTime', 'ShortInformations'];

export default class MediaHeader extends Lightning.Component {
    static _template() {
        const template = { flex: { direction: Direction.Column } };
        fields.forEach(field => {
            template[field] = {
                text: {
                    fontFace: Fonts.Inter,
                    fontSize: 20,
                    textColor: BRANDING_COLORS.WHITE
                }
            };
        });
        return template;
    }

    set props(props) {
        this._props = { ...this._props, ...props };
        const { genres, dateTime, shortInformations } = this._props
        this.patch({
            Genres: { text: joinWords(genres) },
            DateTime: { text: dateTime },
            ShortInformations: { text: shortInformations }
        })
    }

}