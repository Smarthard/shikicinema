import { map } from 'rxjs/operators';

import { VideoMapperFn } from '@app/shared/types/video-mapper.type';

export function toVideoInfo<T>(mapper: VideoMapperFn<T>) {
    return map((videos: T[]) => videos?.map(mapper));
}
