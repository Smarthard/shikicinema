export function getDomain(url: string | URL): string {
    const asUrl = url instanceof URL ? url : new URL(url);

    return asUrl.hostname
        .split('.')
        .slice(-2)
        .join('.');
}
