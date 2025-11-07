export function splitTextInTwoLines(text, maxCharsPerLine) {
    const words = text.split(" ");
    let firstLine = "";
    let secondLine = "";

    for (let word of words) {
        if ((firstLine + (firstLine ? " " : "") + word).length <= maxCharsPerLine) {
            firstLine += (firstLine ? " " : "") + word;
        } else {
            secondLine += (secondLine ? " " : "") + word;
        }
    }
    return { firstLine, secondLine };
}