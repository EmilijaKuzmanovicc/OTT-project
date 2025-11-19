const floorStringPad = (number) => Math.floor(number).toString().padStart(2, '0');


export const FormatTime = (seconds) => {
    console.log(seconds);
    const hours = floorStringPad(seconds / 3600);
    const minutes = floorStringPad((seconds % 3600) / 60);
    const remainingSeconds = floorStringPad(seconds % 60);

    return `${hours === "00" ? '' : hours + ':'}${minutes}:${remainingSeconds}`;
};
