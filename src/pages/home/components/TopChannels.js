import Lightning from "@lightningjs/sdk/src/Lightning";
import { popularChannels } from "../../../utils/PopularChannels";
import { BRANDING_COLORS } from "../../../utils/Colors";
import VerticalContainer from "./verticalContainer/VerticalContainer";
import VerticalItem from "./verticalContainer/VerticalItem";
import { Align, Direction } from "../../../utils/Constants";

export default class TopChannels extends Lightning.Component {
    static _template() {
        return {
            h: 837,
            w: 312,
            rect: true,
            color: BRANDING_COLORS.BLACK,
            shader: {
                type: Lightning.shaders.RoundedRectangle,
                radius: 16,
            },
            flex: { direction: Direction.Column, alignItems: Align.Center },
            ChannelsList: {
                y: 18,
                type: VerticalContainer,

            },
        };
    }

    get _ChannelsList() {
        return this.tag('ChannelsList');
    }

    _getFocused() {
        return this.tag('ChannelsList')
    }

    _init() {
        this.tag('ChannelsList').patch({
            props: {
                railTitle: 'Top 5 Channels',
                items: popularChannels.map(channel => ({
                    type: VerticalItem,
                    props: channel
                }))
            }
        });
    }
}