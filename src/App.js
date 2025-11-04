import { Router, Utils, VideoPlayer } from '@lightningjs/sdk'
import { Fonts } from './utils/constants/ConstantsForStyle.js';
import { IMAGES_URL } from './utils/constants/URLs.js';
import Navbar from './components/widgets/navbar/Navbar.js';
import { BRANDING_COLORS } from './utils/constants/Colors.js';
import Dialog from './components/widgets/dialog/Dialog.js';
import routes from './routes.js';
import LoadingComponent from './components/loaderComponent/loaderComponent.js';
let wasOffline = false;
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
        zIndex: 5,
      },
      color: BRANDING_COLORS.LIGHT_BLACK,
      rect: true,
      BackgroundApp: {
        x: 776,
        w: 1144,
        h: 1080,
        src: Utils.asset(IMAGES_URL.BACKGROUND_SHINDIRI),
      },
      Layout: {
        rect: true,
        x: 0,
        y: 0,
        w: 1920,
        h: 1080,
        color: BRANDING_COLORS.LIGHTER_BLACK,
        zIndex: 1,
      },
      Loading: {
        type: LoadingComponent,
        rect: true,
        w: 1920,
        h: 1080,
        zIndex: 102,
        color: BRANDING_COLORS.LIGHTER_BLACK,
        props: {
          xPos: 960,
          yPos: 540,
        },
      },
      Widgets: {
        Menu: {
          zIndex: 10,
          type: Navbar,
        },
        Dialog: {
          visible: false,
          type: Dialog,
          zIndex: 10,
        },

      }
    }
  }

  get _BackgroundApp() {
    return this.tag("BackgroundApp")
  }
  get _Menu() {
    return this.tag("Widgets.Menu");
  }
  get _Dialog() {
    return this.tag('Widgets.Dialog');
  }
  $setNavbarVisibility(isVisible) {
    this._Menu.setVisibility = isVisible;
  }


  _setup() {
    Router.startRouter(
      {
        ...routes
        ,
      },
      this
    );

    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());

    this.checkNetworkStatusOnline(navigator.onLine);
  }
  checkNetworkStatusOnline(isOnline) {
    if (isOnline) {
      this.handleOnline();
    } else {
      this.handleOffline();
    }
  }
  handleOnline() {
    if (wasOffline) {
      VideoPlayer.play();
      const networkDialog = this._Dialog;
      networkDialog.close();
      wasOffline = false;
    }
  }

  handleOffline() {
    VideoPlayer.pause();
    const networkDialog = this._Dialog;
    networkDialog.open({
      message: 'Problem with Network?',
      actions: [
        {
          label: 'Retry',
          action: () => {
            if (navigator.onLine) {
              networkDialog.close();
              wasOffline = true;
              this.handleOnline();
            }
          },
        },
        {
          label: 'Exit App',
          action: () => {
            this.application.closeApp();
          },
        },
      ],
    });
    wasOffline = true;
  }
}

