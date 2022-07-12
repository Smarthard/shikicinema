export function toBase64(value: string): string {
    return btoa(encodeURIComponent(value));
}

export function fromBase64(value: string): string {
    return decodeURIComponent(atob(value));
}
