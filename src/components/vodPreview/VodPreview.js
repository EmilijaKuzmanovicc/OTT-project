import VerticalContainer from "../../pages/home/components/verticalContainer/VerticalContainer";
import { Router, Lightning } from "@lightningjs/sdk";

export default class VodPreview extends Lightning.Component {
    static _template() {
        return {
            Content: {
                x: 125,
                y: 44,
                w: 700,
                h: 370,
            },
            VodContainer: {
                y: 540,
                x: 44,
                h: 540,
                w: 1832,
                clipping: true,
                Column:
                {
                    collision: true,
                    type: VerticalContainer
                }
            }
        }
    }
    get _VodContainer() {
        return this.tag('VodContainer')
    }
    get _Column() {
        return this.tag('Column')
    }

    set props(props) {
        this._props = this._props || {};
        const { vodType } = props;
        if (this._props.vodType !== vodType) {
            this._props = { ...this._props, ...props }
            const { items } = this._props;
            this._Column.props = {
                items, parentState: 'VodContainer'
            }
        }
        this._setState('VodContainer')
    }

    static _states() {
        return [
            class Content extends this{

            },
            class VodContainer extends this{

                _handleUp() {
                    Router.focusWidget("Menu")
                }
            }
        ]
    }
    _getFocused() {
        return this._VodContainer;
    }
    _handleUp() {
        Router.focusWidget('Menu')
    }
}