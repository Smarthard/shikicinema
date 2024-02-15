import { VideoInfoInterface } from '@app/modules/player/types';

export type VideoMapperFn<T> = (video: T) => VideoInfoInterface;
