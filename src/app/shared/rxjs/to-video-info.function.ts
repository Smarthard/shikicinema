import { catchError, map } from 'rxjs/operators';
import { of, pipe } from 'rxjs';

import { VideoMapperFn } from '@app/shared/types/video-mapper.type';

export function toVideoInfo<T>(mapper: VideoMapperFn<T>) {
    return pipe(
        map(mapper),
        catchError(() => of([])),
    );
}
