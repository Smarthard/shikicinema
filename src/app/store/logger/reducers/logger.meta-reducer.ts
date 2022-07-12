import { ActionReducer } from '@ngrx/store';
import { diff } from 'deep-object-diff';

import { AppStoreInterface } from '@app/store/app-store.interface';
import { isEmptyObject } from '@app/shared/utils/object-utils';


export function loggerMetaReducer(reducer: ActionReducer<AppStoreInterface>): ActionReducer<AppStoreInterface> {
    return (state: AppStoreInterface, action: any): any => {
        const result = reducer(state, action);
        const stateDiff = diff(state, result);

        console.groupCollapsed(action.type);
        console.log('action', action);
        console.log('fired at', new Date().toISOString());
        console.log('prev state', state);
        console.log('next state', result);
        console.log('diff', isEmptyObject(stateDiff) ? 'EMPTY' : stateDiff);
        console.groupEnd();

        return result;
    };
}
