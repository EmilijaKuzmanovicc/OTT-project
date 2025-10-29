import { Lightning, Utils } from '@lightningjs/sdk'
import { IMAGES_URL } from './utils/URLs'
import Home from './pages/home/home.js';
import { Fonts } from './utils/Constants.js';
export default class App extends Lightning.Component {

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
      Background: {
        w: 1920,
        h: 1080,
        src: Utils.asset(IMAGES_URL.BACKGROUND),
      },
      Home: {
        type: Home,
      },
    }
  }

  _getFocused() {
    return this.tag('Home')
  }
}

