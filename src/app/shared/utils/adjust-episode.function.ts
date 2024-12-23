export function adjustEpisode(episode: number | string, currentEpisode: number, maxEpisode = 1): number {
    const episodeAsNum = Number(episode);

    if (Number.isNaN(episodeAsNum)) {
        return currentEpisode;
    } else {
        if (episodeAsNum <= 0) {
            return 1;
        } else if (episodeAsNum > maxEpisode) {
            return maxEpisode;
        } else {
            return episodeAsNum;
        }
    }
}
