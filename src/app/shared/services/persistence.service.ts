import { Injectable } from '@angular/core';

/**
 * @description should be used
 * only for readonly access to storage
 */
@Injectable({
    providedIn: 'root',
})
export class PersistenceService {
    getItem<T>(key: string): T {
        const json = localStorage.getItem(key);

        return JSON.parse(json) as T;
    }
}
