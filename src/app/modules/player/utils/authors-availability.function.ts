import { VideoInfoInterface } from '@app/modules/player/types';


export function authorAvailability(videos: VideoInfoInterface[], lastAiredEpisode: number): string[] {
    const availabilityIssueAuthros: string[] = [];
    const authors = new Set(videos.map(({ author }) => author).filter((author): author is string => !!author));

    for (const targetAuthor of authors) {
        const authorVideos = videos.filter(({ author }) => author === targetAuthor);
        const authorEpisodes = new Set(authorVideos.map(({ episode }) => episode));

        if (authorEpisodes.size !== lastAiredEpisode) {
            availabilityIssueAuthros.push(targetAuthor);
        }
    }

    return availabilityIssueAuthros;
}
