import {
    MetaReducer,
    createReducer,
    on,
} from '@ngrx/store';

import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { PlayerStoreInterface } from '@app/modules/player/store/types';
import {
    addVideosAction,
    getAnimeInfoSuccessAction,
    getCommentsSuccessAction,
    getTopicsSuccessAction,
    setIsShownAllAction,
    watchAnimeSuccessAction,
} from '@app/modules/player/store/actions';
import { filterDuplicatedIds } from '@app/shared/utils/filter-duplicated-ids.function';

const initialState: PlayerStoreInterface = {
    videos: {},
    animeInfo: {},
    comments: {},
};

export const reducers = createReducer(initialState,
    on(
        addVideosAction,
        (state, { animeId, videos }) => ({
            ...state,
            videos: {
                ...state.videos,
                [animeId]: [...state.videos[animeId] || [], ...videos],
            },
        }),
    ),
    on(
        getAnimeInfoSuccessAction,
        (state, { anime }) => ({
            ...state,
            animeInfo: {
                ...state.animeInfo,
                [anime.id]: anime,
            },
        }),
    ),
    on(
        watchAnimeSuccessAction,
        (state, { userRate }) => ({
            ...state,
            animeInfo: {
                ...state.animeInfo,
                [userRate.target_id]: {
                    ...state.animeInfo[userRate.target_id],
                    user_rate: userRate,
                } as AnimeBriefInfoInterface,
            },
        }),
    ),
    on(
        getTopicsSuccessAction,
        (state, { topics, animeId, episode }) => ({
            ...state,
            comments: {
                ...state.comments,
                [animeId]: {
                    ...state.comments?.[animeId] || {},
                    [episode]: {
                        ...state.comments?.[animeId]?.[episode] || {},
                        topic: topics?.[0] || null,
                        isLoading: Boolean(topics?.[0]?.comments_count),
                        isShownAll: Boolean(topics?.[0]?.comments_count <= 20),
                    },
                },
            },
        }),
    ),
    on(
        getCommentsSuccessAction,
        (state, { comments, animeId, episode, limit }) => ({
            ...state,
            comments: {
                ...state.comments,
                [animeId]: {
                    ...state.comments?.[animeId] || {},
                    [episode]: {
                        ...state.comments?.[animeId]?.[episode] || {},
                        isLoading: comments?.length > limit,
                        isShownAll: state.comments?.[animeId]?.[episode]?.isShownAll ?? comments?.length <= 20,
                        comments: [...state.comments?.[animeId]?.[episode]?.comments || [], ...comments]
                            .filter(filterDuplicatedIds),
                    },
                },
            },
        }),
    ),
    on(
        setIsShownAllAction,
        (state, { isShownAll, animeId, episode }) => ({
            ...state,
            comments: {
                ...state.comments,
                [animeId]: {
                    ...state.comments?.[animeId] || {},
                    [episode]: {
                        ...state.comments?.[animeId]?.[episode] || {},
                        isShownAll,
                    },
                },
            },
        }),
    ),
);


export const metaReducers: MetaReducer<PlayerStoreInterface>[] = [];
