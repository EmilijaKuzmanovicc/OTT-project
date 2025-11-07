import { Align, Direction } from "../../../utils/constants/ConstantsForStyle";
import { Utils, Lightning, Router } from "@lightningjs/sdk";
import { IMAGES_URL } from "../../../utils/constants/URLs";
import HorizontalContainer from "../../horizontalContainer/HorizontalContainer";
import NavbarItemCard from "./components/NavbarItemCard";
import { NavbarItemsList } from "./constants/NavbarItems";
import { getRouteNavbarIndex } from "../../../utils/RoutesIndex";
export default class Navbar extends Lightning.Component {
    _selectedMenuItem = 0;
    _menuItemRoutes = [];
    _activeHash = 0;

    static _template() {
        return {
            h: 120,
            w: 1920,
            flex: { direction: Direction.Row, alignItems: Align.Center },
            Image: {
                w: 301,
                h: 60,
                x: 30,
                src: Utils.asset(IMAGES_URL.LOGO),
            },
            Items: {
                w: 675,
                h: 50,
                x: 125,
                y: 10,
                type: HorizontalContainer,
            },
        };
    }

    get _Items() {
        return this.tag("Items");
    }

    get _NavbarItemChildren() {
        return this._Items.Items.children;
    }

    _getFocused() {
        return this._Items;
    }

    async _init() {
        setTimeout(() => {
            const activeHash = Router.getActiveHash();
            const focusedId = getRouteNavbarIndex(activeHash);

            this._activeHash = this._selectedMenuItem = focusedId;

            this._menuItemRoutes = NavbarItemsList.map((item) => item.route);

            this.patch({
                Items: {
                    props: {
                        items: NavbarItemsList.map((item, i) => ({
                            type: NavbarItemCard,
                            props: {
                                name: item.name,
                                selected: i === focusedId,
                                index: i,
                            },
                        })),
                        disableScroll: true,
                        targetIndex: focusedId,
                    },
                },
            });
        }, 100);
    }

    _setSelected(index) {
        this._selectedMenuItem = index;
        this._NavbarItemChildren.forEach((item, i) => {
            item.patch({ props: { selected: i === index } });
        });
    }

    $changePage(index) {
        this._setSelected(index);
        const route = this._menuItemRoutes[index];
        if (route) Router.navigate(route);
        this.stage.focus = this._Items;
    }

    _handleLeft() { return true; }
    _handleRight() { return true; }
    _handleUp() { return true; }
    _handleDown() {
        Router.focusPage();
        return false;
    }
}
