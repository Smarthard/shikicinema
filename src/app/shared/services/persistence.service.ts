import { Injectable } from '@angular/core';

/**
 * @description should be used
 * only for readonly access to storage
 */
@Injectable({
    providedIn: 'root',
})
export class PersistenceService {
    private static readonly MAX_LOCALSTORAGE_SIZE_KEY = 'MAX_LS_SIZE';

    getItem<T>(key: string): T {
        const json = localStorage.getItem(key);

        return JSON.parse(json) as T;
    }

    setItem<T>(key: string, value: T): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    getUsedBytes(): number {
        const exceptCached = Object.entries(localStorage)
            .filter(([key, _]) => key !== 'cache')
            .map(([_, value]) => value);

        return new Blob(exceptCached).size;
    }

    getCacheBytes(): number {
        return new Blob([localStorage.getItem('cache')]).size;
    }

    // не забываем, что setItem синхронный - и эта функция довольно жестко блочит отрисовку странички без кэша
    getMaxByxes(): number {
        const step = 500;
        const cached = this.getItem<number>(PersistenceService.MAX_LOCALSTORAGE_SIZE_KEY);
        let i = 0;

        if (cached) {
            return cached;
        }

        try {
            for (i = step; i <= 10 * 1024; i += step) {
                this.setItem('test', new Array(i * 1024).join('a'));
            }
        } catch (e) {
            this.removeItem('test');
        } finally {
            const maxSize = i - step;

            this.setItem(PersistenceService.MAX_LOCALSTORAGE_SIZE_KEY, maxSize * 1024);
            return maxSize * 1024;
        }
    }
}
