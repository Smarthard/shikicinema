import {
    Observable,
    from,
    shareReplay,
    startWith,
} from 'rxjs';

export function isSupportsAvif(): Observable<boolean> {
    return from(
        new Promise<boolean>((resolve) => {
            const image = new Image();
            image.onerror = () => resolve(false);
            image.onload = () => resolve(true);
            image.src = '/assets/1x1.avif';
        }).catch(() => false),
    ).pipe(
        startWith(undefined),
        shareReplay(1),
    );
}
