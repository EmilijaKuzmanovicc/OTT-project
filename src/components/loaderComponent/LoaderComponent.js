import { Utils, Lightning } from '@lightningjs/sdk';
import lng from '@lightningjs/core';
import { IMAGES_URL } from '../../utils/constants/URLs';
import { BRANDING_COLORS } from '../../utils/constants/Colors';

export default class LoadingComponent extends Lightning.Component {
    _props = {
        xPos: 960,
        yPos: 540,
    };

    static _template() {
        return {
            rect: true,
            color: BRANDING_COLORS.BLACK,
            Spinner: {
                w: 100,
                h: 100,
                texture: lng.Tools.getSvgTexture(Utils.asset(IMAGES_URL.LOADER), 100, 100),
                mount: 0.5,
                rotation: 0,
            },
        };
    }

    get _Spinner() { return this.tag('Spinner'); }

    set props(props) {
        this._props = { ...this._props, ...props };
        const { xPos, yPos } = this._props;
        this._Spinner.patch({
            x: xPos,
            y: yPos,
        });
    }

    _init() {
        this._spin();
    }

    _spin() {
        this._Spinner
            .animation({
                duration: 2,
                repeat: -1,
                actions: [
                    { p: 'rotation', v: { 0: 0, 1: 10 * Math.PI } },
                ],
            })
            .start();
    }
}
