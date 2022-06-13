export function isEmptyObject<T = any>(obj: T): boolean {
    // eslint-disable-next-line guard-for-in
    for (const key in obj) {
        return false;
    }

    return true;
}
