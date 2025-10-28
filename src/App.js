import { Lightning, Utils } from '@lightningjs/sdk'
import { IMAGES_URL } from './utils/URLs'
import Home from './pages/home/home.js';
export default class App extends Lightning.Component {

  static getFonts() {
    return [
      { family: 'Inter', url: Utils.asset('fonts/Inter_28pt-Regular.ttf') },
      { family: 'InterBold', url: Utils.asset('fonts/Inter_28pt-Bold.ttf') },
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

