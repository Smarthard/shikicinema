export function isEmptyObject<T = unknown>(obj: T): boolean {
    return Object.keys(obj)?.length === 0;
}
