import Lightning from "@lightningjs/sdk/src/Lightning";
import ContentSection from "./components/PopularSection";

export default class Home extends Lightning.Component {
    static _template() {
        return {
            Content: {
                x: 64,
                y: 125,
                w: 1920,
                h: 980,
                type: ContentSection,
            },
            TopFive: {

            }
        };
    }

    get _Content() {
        return this.tag('Content');
    }

    get _TopFive() {
        return this.tag('TopFive');
    }

    _getFocused() {
        return this.tag('Content')

    }

}