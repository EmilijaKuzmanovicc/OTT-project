import { Lightning } from '@lightningjs/sdk';
import VerticalItem from './VerticalItem/VerticalItem';

export default class VerticalContainer extends Lightning.Component {
    _focusedIndex = 0;

    static _template() {
        return {
            w: 250,
            h: 600,
            flex: { direction: 'column', alignItems: 'center' },
            Title: {
                text: {
                    text: 'Top 5 Channels',
                    fontSize: 40,
                    fontFace: 'Montserrat-Medium',
                    textColor: 0xffffffff,
                },
            },
            Items: {
                flex: { direction: 'column' },
            },
        };
    }

    get Items() {
        return this.tag('Items');
    }

    set items(data) {
        this._items = data.map(item => ({
            type: VerticalItem,
            itemData: item,
        }));
        this.Items.childList.clear();
        this.Items.childList.a(this._items);
        this._focusedIndex = this._items.length > 0 ? 0 : -1;
    }

    _getFocused() {
        return this.Items?.children?.[this._focusedIndex];
    }

    _handleDown() {
        if (this._focusedIndex < this._items.length - 1) {
            this.Items.children[this._focusedIndex]?._unfocus();
            this._focusedIndex += 1;
            return true;
        }
        return false;
    }

    _handleUp() {
        if (this._focusedIndex > 0) {
            this.Items.children[this._focusedIndex]?._unfocus();
            this._focusedIndex -= 1;
            return true;
        }
        return false;
    }

    _handleLeft() {
        this.fireAncestors('$handleLeft', 'Movies')
    }
}