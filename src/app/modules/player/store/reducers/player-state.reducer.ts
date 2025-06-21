import {
    createReducer,
    on,
} from '@ngrx/store';

import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { PlayerStoreInterface } from '@app/modules/player/store/types';
import {
    addVideosAction,
    deleteCommentSuccessAction,
    editCommentSuccessAction,
    getAnimeInfoSuccessAction,
    getCommentsSuccessAction,
    getTopicsAction,
    getTopicsSuccessAction,
    getUserRateSuccessAction,
    sendCommentSuccessAction,
    setIsShownAllAction,
    watchAnimeSuccessAction,
} from '@app/modules/player/store/actions';
import { filterComments, patchComments } from '@app/modules/player/store/utils';
import { filterDuplicatedIds } from '@app/shared/utils/filter-duplicated-ids.function';

const initialState: PlayerStoreInterface = {
    videos: {},
    animeInfo: {},
    comments: {},
};

export const playerReducer = createReducer(initialState,
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
        getUserRateSuccessAction,
        (state, { userRate, animeId }) => ({
            ...state,
            animeInfo: {
                ...state.animeInfo,
                [animeId]: {
                    ...state.animeInfo[animeId],
                    user_rate: userRate ? { ...userRate } : null,
                } as AnimeBriefInfoInterface,
            },
        }),
    ),
    on(
        getTopicsAction,
        (state, { animeId, episode, revalidate }) => ({
            ...state,
            comments: {
                ...state.comments,
                [animeId]: {
                    ...state.comments?.[animeId] || {},
                    [episode]: {
                        ...state.comments?.[animeId]?.[episode] || {},
                        topic: revalidate ? null : state.comments?.[animeId]?.[episode]?.topic,
                    },
                },
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
        sendCommentSuccessAction,
        (state, { comment, animeId, episode }) => ({
            ...state,
            comments: {
                ...state.comments,
                [animeId]: {
                    ...state.comments?.[animeId] || {},
                    [episode]: {
                        ...state.comments?.[animeId]?.[episode] || {},
                        comments: [...state.comments?.[animeId]?.[episode]?.comments || [], comment],
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
    on(
        editCommentSuccessAction,
        (state, { animeId, episode, comment }) => ({
            ...state,
            comments: {
                ...state.comments,
                [animeId]: {
                    ...state.comments?.[animeId] || {},
                    [episode]: {
                        comments: patchComments(comment, state.comments?.[animeId]?.[episode]?.comments),
                    },
                },
            },
        }),
    ),
    on(
        deleteCommentSuccessAction,
        (state, { animeId, episode, commentId: deletedId }) => ({
            ...state,
            comments: {
                ...state.comments,
                [animeId]: {
                    ...state.comments?.[animeId] || {},
                    [episode]: {
                        comments: filterComments(deletedId, state.comments?.[animeId]?.[episode]?.comments),
                    },
                },
            },
        }),
    ),
);
