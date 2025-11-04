import { Align, Direction } from "../../../utils/constants/ConstantsForStyle";
import { Utils, Lightning, Router } from "@lightningjs/sdk";
import { IMAGES_URL } from "../../../utils/constants/URLs";
import HorizontalContainer from "../../horizontalContainer/HorizontalContainer";
import NavbarItemCard from "./components/NavbarItemCard";
import { NavbarItemsList } from "./constants/NavbarItems";
import { getRouteNavbarIndex } from "../../../utils/RoutesIndex";


export default class Navbar extends Lightning.Component {
    _selectedMenuItem = 0;
    _index = 0;
    _newIndex = 0;
    _menuItemRoutes = [];
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
                type: HorizontalContainer
            }
        }

    }
    get _Items() {
        return this.tag('Items');
    }

    _getFocused() {
        return this._Items;
    }


    async _active() {
        this.patch({
            Items: {
                props: {
                    items: NavbarItemsList.map((item, i) => ({
                        type: NavbarItemCard,
                        props: { name: item.name, selected: i === 0 },
                    })),
                }
            }
        });
        this._menuItemRoutes = NavbarItemsList.map((item) =>

            item.route
        );



        this._selectedMenuItem = 0;
        this._setState('Items');
    }

    _setSelected(index) {
        this._selectedMenuItem = index;

        this._Items.children.forEach((item, i) => {
            item.patch({
                props: { selected: i === index }
            });
        });
    }



    _focus() {
        this._Items.children.forEach((item, i) => {
            item.patch({
                props: { selected: i === this._selectedMenuItem }
            });
        });
    }

    $changePage(index) {
        this._setSelected(index);
        this._index = index;
        const route = this._menuItemRoutes[index];
        if (route) {
            Router.navigate(route);
        }
    }

    _handleLeft() { return true; }
    _handleUp() { return true; }

    _handleDown() {
        Router.focusPage()
        return false
    }

} 