import Lightning from "@lightningjs/sdk/src/Lightning";
import { Clamp } from "../../utils/Clamp";

export default class HorizontalContainer extends Lightning.Component {
    _props = {
        items: [],
        paddingLeft: 0,
        disableScroll: false,
    };
    _focusedIndex = -1;
    _scrollPosition = 0;

    static _template() {
        return {
            signals: {
                changeHeroBackground: true,
            },

            flex: { direction: "row", wrap: true },
            Title: {},
            Items: {
                y: 0,
                flex: {
                    direction: "row",
                },
            },
        };
    }
    changeHeroBackground(id, backdrop_path) {
        this.signal("changeHeroBackground", id, backdrop_path);
    }

    get Items() { return this.tag("Items"); }

    get Title() { return this.tag("Title"); }

    get _focusedIndex() { return this._focusedIndex; }

    set _focusedIndex(val) {
        this._focusedIndex = val;
    }

    $horizontalPosterIndexChange(val) {
        this.Items.children[this._focusedIndex]?._unfocus();
        this._setFocusedIndex(val);
    }

    $handleItemHover(index) {
        if (this._focusedIndex !== index) {
            this.Items.children[this._focusedIndex]?._unfocus();
            this._focusedIndex = index;
        }
        this._reCalibrateScroll();

        this.fireAncestors("$handleHoverState", this.ref);
    }

    setFocus(index) {
        this._setFocusedIndex(index);
    }

    _unfocus() {
        this.Items.children[this._focusedIndex]?._unfocus();
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
        //this._focusedIndex = newIndex;
        this._reCalibrateScroll();
        this.fireAncestors(
            "$horizontalContainerIndexChange",
            this._focusedIndex,
            this._scrollPosition
        );
    }

    set props(props) {
        const { items, railTitle, ...rest } = props;
        this._props = { ...this._props, ...rest };
        const { cardType, targetIndex } = rest;

        if (railTitle && railTitle !== "") {
            const { h } = rest;
            this.Items.patch({
                y: 0,
            });
            this.patch({
                h: h + 95,
                Title: {
                    x: 0,
                    y: 0,
                    h: 45,
                    text: {
                        text: railTitle,
                        fontFace: "InterBold",
                        fontSize: 24,
                        letterSpacing: 6,
                        textTransform: "uppercase",
                    },
                },
            });
        } else {
            this.patch({ ...rest });
            this.Items.patch({ h: rest.h });
        }

        this.patch({
            w: this._w,
        });

        if (items !== this._props.items) {
            this._props.items = items;

            this.Items.x = 0;

            this.Items.childList.clear();
            if (items?.length > 0) {
                this.Items.childList.a(items);
            }

            if (targetIndex) {
                this._setFocusedIndex(targetIndex);
            } else {
                this._focusedIndex = items?.length > 0 ? 0 : -1;
            }

            if (cardType === "EPG_CARD_ITEM") {
                this.Items.children[0].patch({
                    flex: {
                        paddingLeft: this._props.paddingLeft,
                    },
                });
                this._scrollPosition = this._props.paddingLeft + this.w || 0;
            }

        }
        this.stage.update();
    }
    _setScrollPosition(x) {
        this._scrollPosition = x;
        this.Items.smooth = { x: this._scrollPosition };
    }

    _reCalibrateScroll() {
        if (!this._props.disableScroll) {
            this.stage.update();

            const currentFocus = this.Items.children[this._focusedIndex];

            if (!currentFocus) return;

            const containerFinalWidth = this.finalW;
            const elementX = currentFocus.finalX;
            const elementW = currentFocus.finalW;

            if (elementX < -this._scrollPosition) {
                const paddingOffset = currentFocus.flex?._paddingLeft ?? 0;
                this._scrollPosition = -elementX - paddingOffset;
            } else if (
                elementX + elementW >
                containerFinalWidth - this._scrollPosition
            ) {
                this._scrollPosition = -(elementX + elementW - containerFinalWidth);
            }

            this.Items.smooth = { x: this._scrollPosition };
        }
    }

    _getFocused() {
        return this.Items?.children?.[this._focusedIndex];
    }

    _handleDown() {
        return false;
    }

    _handleUp() {
        return false;
    }

    _handleHover() {
        let verticalState;

        const parentContainer = this.parent.parent.ref;
        const indexForVC = this.parent.children.indexOf(this);
        const constructorName =
            this.Items.children[this._focusedIndex]?.constructor.name;

        if (
            constructorName === "PosterRailItem" &&
            parentContainer === "VODSection"
        ) {
            verticalState = "VODSection";
        }
        if (
            constructorName === "PosterRailItem" &&
            parentContainer !== "VODSection"
        ) {
            verticalState = "VodContainer";
        }
        if (constructorName === "SportsEventsRailItem") {
            verticalState = "VodContentContainer";
        }
        if (constructorName === "LandscapeRailItem") {
            verticalState = "Items";
        }
        if (constructorName === "EPGRailItems") {
            verticalState = "EPGS";
        }

        this.fireAncestors(
            "$horizontalContainerPosterIndexChange",
            indexForVC,
            verticalState
        );
    }

    _handleRight() {
        // this.Items.children[this._focusedIndex]._unfocus();
        const { items } = this._props;
        if (this._focusedIndex < items.length - 1) {
            this.Items.children[this._focusedIndex]._unfocus();
            this._focusedIndex += 1;

            this._reCalibrateScroll();
            this.fireAncestors(
                "$horizontalContainerIndexChange",
                this._focusedIndex,
                this._scrollPosition
            );
        } else {
            return false;
        }
        return true;
    }

    _handleLeft() {
        // this.Items.children[this._focusedIndex]._unfocus();
        if (this._focusedIndex > 0) {
            this.Items.children[this._focusedIndex]?._unfocus();
            this._focusedIndex -= 1;
            this._reCalibrateScroll();
            this.fireAncestors(
                "$horizontalContainerIndexChange",
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
            focusedItem.signal("select");
        }
        return true;
    }
}
