import { Router, Utils, Colors, Lightning } from '@lightningjs/sdk'
import { Fonts } from './utils/constants/ConstantsForStyle.js';
import { IMAGES_URL } from './utils/constants/URLs.js';
import Navbar from './components/widgets/navbar/Navbar.js';
import { BRANDING_COLORS } from './utils/constants/Colors.js';
import routes from './routes.js';
import "@lightningjs/core/inspector";
import LoadingComponent from './components/loaderComponent/LoaderComponent.js';
import { getDeviceType } from './utils/device/device.js';
export default class App extends Router.App {
  static getFonts() {
    return [
      { family: Fonts.Inter, url: Utils.asset('fonts/Inter_28pt-Regular.ttf') },
      { family: Fonts.InterBold, url: Utils.asset('fonts/Inter_28pt-Bold.ttf') },
      { family: Fonts.ExtraBold, url: Utils.asset('fonts/Inter_18pt-ExtraBold.ttf') },
      { family: Fonts.SemiBold, url: Utils.asset('fonts/Inter_18pt-SemiBold.ttf') },
    ]
  }

  static _template() {
    return {
      ...super._template(),
      w: 1920,
      h: 1080,
      Pages: {
        collision: true,
        w: 1920,
        h: 1080,
        zIndex: 15,
      },
      Background: {
        rect: true,
        x: 0,
        y: 0,
        w: 1920,
        h: 1080,
        color: BRANDING_COLORS.LIGHT_BLACK,
        zIndex: 0,

        Image: {
          x: 776,
          w: 1144,
          h: 1080,
          src: Utils.asset(IMAGES_URL.BACKGROUND_SHINDIRI),
          mountX: 0,
          mountY: 0,
          zIndex: 1,
        },
        Layout: {
          rect: true,
          x: 0,
          y: 0,
          w: 1920,
          h: 1080,
          color: BRANDING_COLORS.LIGHTER_BLACK,
          zIndex: 2,
        },
      },
      Loading: {
        type: LoadingComponent,
        // rect: true,
        // w: 1920,
        // h: 1080,
        zIndex: 20,
        color: BRANDING_COLORS.LIGHTER_BLACK,
        props: {
          xPos: 960,
          yPos: 540,
        },
      },
      Widgets: {
        Menu: {
          zIndex: 17,
          type: Navbar,
        },
      },

    }
  }

  get _Background() {
    return this.tag("Background")
  }
  get _Menu() {
    return this.tag("Widgets.Menu");
  }

  $punchHole() {
    this.tag('Background').shader = {
      color: Colors('#1F2227').get(),
      type: Lightning.shaders.Hole,
      x: 0,
      y: 0,
      w: 1920,
      h: 1080,
    }
  }
  $unpunchHole() {
    this.tag('Background').shader = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    };
  }
  _setup() {
    Router.startRouter(
      {
        ...routes,
        afterEachRoute: (request) => {
          this.patch({
            Widgets: { Menu: { props: { route: request._hash } } },
          })
        },
      },
      this
    );
  }

  $appClose() {
    const device = getDeviceType();

    switch (device) {
      case 'hisense':
        this.application.closeApp();
        break;
      case 'tizen':
        if (window.tizen) {
          window.tizen.application.getCurrentApplication().exit();
        }
        break;
      case 'webos':
        if (window.webos) {
          window.close();
        }
        break;
      default:
        window.close();
        break;
    }
  }


}

