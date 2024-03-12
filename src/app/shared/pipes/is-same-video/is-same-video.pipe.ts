import { Pipe, PipeTransform } from '@angular/core';

import { VideoInfoInterface } from '@app/modules/player/types';

@Pipe({
    name: 'isSameVideo',
    pure: true,
    standalone: true,
})
export class IsSameVideoPipe implements PipeTransform {
    transform(a: VideoInfoInterface, b: VideoInfoInterface): boolean {
        return !!a && !!b && a.url === b.url;
    }
}
