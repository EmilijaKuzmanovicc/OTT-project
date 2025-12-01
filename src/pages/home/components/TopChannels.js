import { Lightning } from "@lightningjs/sdk";
import { popularChannels } from "../../../utils/constants/PopularChannels";
import { BRANDING_COLORS } from "../../../utils/constants/Colors";
import VerticalContainer from "../../../components/verticalContainer/VerticalContainer";
import ChannelItem from "./ChannelItem";
import { Align, Direction } from "../../../utils/constants/ConstantsForStyle";


export default class TopChannels extends Lightning.Component {
    static _template() {
        return {
            h: 837,
            w: 312,
            rect: true,
            color: BRANDING_COLORS.BLACK,
            collision: true,
            shader: {
                type: Lightning.shaders.RoundedRectangle,
                radius: 16,
            },
            flex: { direction: Direction.Column, alignItems: Align.Center },
            ChannelsList: {
                collision: true,
                h: 837,
                w: 312,
                y: 18,
                type: VerticalContainer,
            },
        };
    }

    get _ChannelsList() { return this.tag('ChannelsList'); }

    _getFocused() {
        return this.tag('ChannelsList')
    }

    $handleHoverState(ref) {
        const currentState = this._getState();
        if (ref !== currentState) {
            if (currentState) this.tag(currentState)._unfocus();
            this._setState(ref);
        }
        this.fireAncestors("$handleHoverState", this.ref);
    }

    _init() {
        this.tag('ChannelsList').patch({
            props: {
                railTitle: 'Top 5 Channels',
                items: popularChannels.map(channel => ({
                    type: ChannelItem,
                    props: channel,
                    parentState: "TopChannels"
                }))
            }
        });
    }
}