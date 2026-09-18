export function isEmptyObject<T = unknown>(obj: T): boolean {
    return obj && Object.keys(obj)?.length === 0;
}
