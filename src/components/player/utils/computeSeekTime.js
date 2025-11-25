import { VideoPlayer } from "@lightningjs/sdk";

export const computeSeekTime = (delta, newTime) => {
    const base = newTime != null ? newTime : VideoPlayer.currentTime;
    const result = base + delta;
    return Math.max(0, Math.min(result, VideoPlayer.duration));
}