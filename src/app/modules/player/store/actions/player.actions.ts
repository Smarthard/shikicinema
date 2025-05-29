import { createAction, props } from '@ngrx/store';

import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { ApiErrorInfo } from '@app/shared/types/shikimori/api-error-info.interface';
import { Comment } from '@app/shared/types/shikimori/comment';
import { ResourceIdType } from '@app/shared/types/resource-id.type';
import { Topic } from '@app/shared/types/shikimori/topic';
import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';
import { VideoInfoInterface } from '@app/modules/player/types';

export const addVideosAction = createAction(
    '[Player] Add videos',
    props<{ animeId: string, videos: VideoInfoInterface[] }>(),
);

export const findVideosAction = createAction(
    '[Player] Find videos',
    props<{ animeId: string }>(),
);

export const findVideosSuccessAction = createAction(
    '[Player] Find success videos',
);

export const findVideosFailureAction = createAction(
    '[Player] Find failure videos',
);

export const getAnimeInfoAction = createAction(
    '[Player] Get anime info',
    props<{ animeId: string }>(),
);

export const getAnimeInfoSuccessAction = createAction(
    '[Player] Get anime info success',
    props<{ anime: AnimeBriefInfoInterface }>(),
);

export const getAnimeInfoFailureAction = createAction(
    '[Player] Get anime info failure',
);

export const watchAnimeAction = createAction(
    '[Player] watch anime',
    props<{
        animeId: number,
        episode: number,
        isRewarch?: boolean
    }>(),
);

export const watchAnimeSuccessAction = createAction(
    '[Player] watch anime success',
    props<{ animeId: ResourceIdType, userRate: UserAnimeRate }>(),
);

export const getUserRateAction = createAction(
    '[Player] get user rate by id',
    props<{ id: ResourceIdType, animeId: ResourceIdType }>(),
);

export const getUserRateSuccessAction = createAction(
    '[Player] get user rate by id success',
    props<{ userRate: UserAnimeRate, animeId: ResourceIdType }>(),
);

export const getUserRateFailureAction = createAction(
    '[Player] get user rate by id failure',
);

export const watchAnimeFailureAction = createAction(
    '[Player] watch anime failure',
    props<{ errors: ApiErrorInfo }>(),
);

export const getTopicsAction = createAction(
    '[Player] get topics',
    props<{
        animeId: number,
        episode: number,
        revalidate: boolean,
    }>(),
);

export const getTopicsSuccessAction = createAction(
    '[Player] get topics success',
    props<{
        animeId: number,
        episode: number,
        topics: Topic[],
    }>(),
);

export const getTopicsFailureAction = createAction(
    '[Player] get topics failure',
    props<{ errors: ApiErrorInfo }>(),
);

export const getCommentsAction = createAction(
    '[Player] get comments',
    props<{
        animeId: ResourceIdType,
        episode: number,
        page: number,
        limit: number,
    }>(),
);

export const getCommentsSuccessAction = createAction(
    '[Player] get comments success',
    props<{
        animeId: ResourceIdType,
        episode: number,
        page: number,
        limit: number,
        comments: Comment[],
    }>(),
);

export const getCommentsFailureAction = createAction(
    '[Player] get comments failure',
    props<{ errors: ApiErrorInfo }>(),
);

export const setIsShownAllAction = createAction(
    '[Player] set is shown all comments',
    props<{
        isShownAll: boolean,
        animeId: ResourceIdType,
        episode: number,
    }>(),
);

export const sendCommentAction = createAction(
    '[Player] send comment',
    props<{
        animeId: ResourceIdType,
        episode: number,
        commentText: string,
    }>(),
);

export const sendCommentSuccessAction = createAction(
    '[Player] send comment success',
    props<{
        animeId: ResourceIdType,
        episode: number,
        comment: Comment,
    }>(),
);

export const sendCommentFailureAction = createAction(
    '[Player] send comment failure',
    props<{ errors: any }>(),
);
