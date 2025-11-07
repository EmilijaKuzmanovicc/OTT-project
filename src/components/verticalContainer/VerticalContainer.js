import { Lightning } from "@lightningjs/sdk";
import { Clamp } from "../../utils/Clamp";
import { Direction, Align, Fonts } from '../../utils/constants/ConstantsForStyle';
import { BRANDING_COLORS } from "../../utils/constants/Colors";

export default class VerticalContainer extends Lightning.Component {
    _props = {
        textColor: BRANDING_COLORS.WHITE,
        items: [],
        props: '',
        paddingTop: 0,
        disableScroll: false,
    };

    _focusedIndex = -1;
    _scrollPosition = 0;

    static _template() {
        return {
            flex: { direction: Direction.Column, alignItems: Align.Center, },
            Title: {
                h: 50,
                text: {
                    fontFace: Fonts.InterBold,
                    letterSpacing: 0,
                    fontSize: 24,
                },
            },
            Items: {
                flex: {
                    direction: Direction.Column,

                },
            },
        };
    }
    get Items() {
        return this.tag('Items');
    }

    get Title() {
        return this.tag('Title');
    }

    get _focusedIndex() {
        return this._focusedIndex;
    }

    set _focusedIndex(val) {
        this._focusedIndex = val;
    }

    $verticalPosterIndexChange(val) {
        this.Items.children[this._focusedIndex]?._unfocus();
        this._setFocusedIndex(val);
    }

    _appendItems(items) {
        items?.forEach((item) => {
            this._props.items.push(item);
            this.Items.childList.a(item);
        });
        this.stage.update();
    }

    _setFocusedIndex(newIndex) {
        this._focusedIndex = Clamp(newIndex, 0, this._props.items.length - 1);
        this._reCalibrateScroll();
        this.fireAncestors('$verticalContainerIndexChange', this._focusedIndex, this._scrollPosition);
    }

    set props(props) {
        const { items, railTitle, textColor, ...rest } = props;

        this._props = { ...this._props, ...rest };

        const { cardType, targetIndex } = rest;

        if (railTitle && railTitle !== '') {
            const { w } = rest;
            this.Items.patch({
                x: 0,
            });
            this.patch({
                w: w,
                Title: {
                    x: 0,
                    y: 0,
                    text: {
                        text: railTitle,
                        textColor: textColor ?? this._props.textColor,
                    },
                },
            });
        } else {
            this.patch({ ...rest });
            this.Items.patch({ w: rest.w });
        }

        this.patch({
            h: this._props.h,
        });

        if (items !== this._props.items) {
            this._props.items = items;

            this.Items.y = 0;

            this.Items.childList.clear();
            if (items?.length > 0) {
                this.Items.childList.a(items);
            }

            if (targetIndex) {
                this._setFocusedIndex(targetIndex);
            } else {
                this._focusedIndex = items?.length > 0 ? 0 : -1;
            }

            if (cardType === 'EPG_CARD_ITEM') {
                this.Items.children[0].patch({
                    flex: {
                        paddingTop: this._props.paddingTop,
                    },
                });

                this._scrollPosition = this._props.paddingTop + this.h || 0;
            }
        }
        this.stage.update();
    }

    _setScrollPosition(y) {
        this._scrollPosition = y;
        this.Items.smooth = { y: this._scrollPosition };
    }

    _reCalibrateScroll() {
        if (!this._props.disableScroll) {
            this.stage.update();

            const currentFocus = this.Items.children[this._focusedIndex];
            if (!currentFocus) return;

            const containerFinalHeight = this.finalH;
            const elementY = currentFocus.finalY;
            const elementH = currentFocus.finalH;

            if (elementY < -this._scrollPosition) {
                const paddingOffset = currentFocus.flex?._paddingTop ?? 0;
                this._scrollPosition = -elementY - paddingOffset;
            } else if (elementY + elementH > containerFinalHeight - this._scrollPosition) {
                this._scrollPosition = -(elementY + elementH - containerFinalHeight);
            }

            this.Items.smooth = { y: this._scrollPosition };
        }
    }

    _getFocused() {
        return this.Items?.children?.[this._focusedIndex];
    }

    _handleLeft() {
        return false;
    }

    _handleRight() {
        return false;
    }

    _handleHover() {
        let horizontalState;

        const parentContainer = this.parent.parent.ref;
        const indexForHC = this.parent.children.indexOf(this);
        const constructorName = this.Items.children[this._focusedIndex]?.constructor.name;

        if (constructorName === 'PosterRailItem' && parentContainer === 'VODSection') {
            horizontalState = 'VODSection';
        }
        if (constructorName === 'PosterRailItem' && parentContainer !== 'VODSection') {
            horizontalState = 'VodContainer';
        }
        if (constructorName === 'SportsEventsRailItem') {
            horizontalState = 'VodContentContainer';
        }
        if (constructorName === 'LandscapeRailItem') {
            horizontalState = 'Items';
        }
        if (constructorName === 'EPGRailItems') {
            horizontalState = 'EPGS';
        }

        this.fireAncestors('$verticalContainerPosterIndexChange', indexForHC, horizontalState);
    }

    _handleDown() {
        const { items } = this._props;
        if (this._focusedIndex < items.length - 1) {
            this.Items.children[this._focusedIndex]._unfocus();
            this._focusedIndex += 1;
            this.fireAncestors(
                '$verticalContainerIndexChange',
                this._focusedIndex,
                this._scrollPosition
            );
        } else {
            return false;
        }
        return true;
    }

    _handleUp() {
        if (this._focusedIndex > 0) {
            this.Items.children[this._focusedIndex]?._unfocus();
            this._focusedIndex -= 1;
            this.fireAncestors(
                '$verticalContainerIndexChange',
                this._focusedIndex,
                this._scrollPosition
            );
        } else {
            return false;
        }
        return true;
    }

    _handleEnter() {
        const focusedItem = this.Items.children[this._focusedIndex];
        if (focusedItem) {
            focusedItem.signal('select');
        }
        return true;
    }
}
