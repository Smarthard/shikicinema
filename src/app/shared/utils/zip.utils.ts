import { gunzipSync, gzipSync } from 'fflate';

export function zip(str: string): string {
    const ascii = encodeURIComponent(str);
    const array = new TextEncoder().encode(ascii);
    const zip = gzipSync(array);
    return btoa(String.fromCharCode(...zip));
}

export function unzip(base64: string): string {
    const raw = atob(base64);
    const array = Uint8Array.from(raw, (c) => c.charCodeAt(0));
    const unzip = gunzipSync(array);
    const ascii = new TextDecoder().decode(unzip);
    return decodeURIComponent(ascii);
}
