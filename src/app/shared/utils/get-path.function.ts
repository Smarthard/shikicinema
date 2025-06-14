export function getPath(url: string): string {
    const path = url?.startsWith('/')
        ? url
        : new URL(url).pathname;

    return path;
}
