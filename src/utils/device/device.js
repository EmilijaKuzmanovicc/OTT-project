export const getDeviceType = () => {
    if (window.tizen) return "tizen";
    if (window.webos) return "webos";
    if (window.Hisense) return "hisense";
    return "web";
};