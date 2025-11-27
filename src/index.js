import { Launch } from "@lightningjs/sdk";
import { getDeviceType } from "./utils/device/device.js";
import Settings from "../settings.json";
import App from "./App.js";

const device = getDeviceType();
switch (device) {
    case 'tizen':
        Settings.appSettings.keys = {
            10009: 'Back',
            10182: 'Exit',
            427: 'ChannelUp',
            428: 'ChannelDown',
            10252: 'MediaPlayPause',
            412: 'MediaRewind',
            417: 'MediaFastForward',
            415: 'MediaPlay',
            19: 'MediaPause',
            413: 'MediaStop',
        };
        break;
    case 'webos':
        Settings.appSettings.keys = {
            461: 'Back',
            33: 'ChannelUp',
            34: 'ChannelDown',
            415: 'MediaPlay',
            19: 'MediaPause',
            417: 'MediaFastForward',
            412: 'MediaRewind',
            413: 'MediaStop',
        };
        break;
    case 'hisense':
        Settings.appSettings.keys = {
            8: 'Back',
            427: 'ChannelUp',
            428: 'ChannelDown',
            415: 'MediaPlay',
            19: 'MediaPause',
            417: 'MediaFastForward',
            412: 'MediaRewind',
            413: 'MediaStop',
        };
        break;
    default:
        break;
}
const app = Launch(App, Settings.appSettings, Settings.platformSettings);
const canvas = app.stage.getCanvas();
document.body.appendChild(canvas);