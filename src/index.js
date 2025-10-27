import { Launch } from "@lightningjs/sdk";
import App from "./App.js";
import { appSettings, platformSettings } from "../settings.json";

const app = Launch(App, appSettings, platformSettings);
const canvas = app.stage.getCanvas();
document.body.appendChild(canvas);