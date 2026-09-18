export function toBase64(value?: string | null): string {
    return btoa(encodeURIComponent(value ?? `${value}`));
}

export function fromBase64(value?: string | null): string {
    return decodeURIComponent(atob(value ?? `${value}`));
}
