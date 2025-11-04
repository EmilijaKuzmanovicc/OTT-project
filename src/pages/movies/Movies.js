import { Lightning } from "@lightningjs/sdk";

export default class Movies extends Lightning.Component {
    static _template() {
        return {
            Text: {
                text: "Movies"
            }
        }
    }
}