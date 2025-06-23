import { Pipe, PipeTransform } from '@angular/core';
import { VideoInfoInterface } from '@app/modules/player/types';


@Pipe({
    name: 'authorAvailabilityWarning',
    standalone: true,
    pure: false,
})
export class AuthorAvailabilityWarningPipe implements PipeTransform {
    transform(videos: VideoInfoInterface[], lastAiredEpisode: number): string[] {
        const availabilityIssueAuthros: string[] = [];
        const authors = new Set(videos?.map(({ author }) => author));

        for (const targetAuthor of authors) {
            const authorVideos = videos?.filter(({ author }) => author === targetAuthor);
            const authorEpisodes = new Set(authorVideos?.map(({ episode }) => episode));

            if (authorEpisodes.size !== lastAiredEpisode) {
                availabilityIssueAuthros.push(targetAuthor);
            }
        }

        return availabilityIssueAuthros;
    }
}
