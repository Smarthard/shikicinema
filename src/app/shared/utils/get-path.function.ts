export function getPath(url: string): string {
    let path = url;

    try {
        const toUrl = url?.startsWith('/')
            ? url
            : new URL(url);

        path = toUrl instanceof URL
            ? toUrl.pathname + toUrl.search + toUrl.hash
            : url;
    } catch (e) {
        path = url;
    }

    return path;
}
