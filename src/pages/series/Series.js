import { Lightning } from "@lightningjs/sdk";

export default class Series extends Lightning.Component {
    static _template() {
        return {
            Text: {
                text: "Series"
            }
        }
    }
}