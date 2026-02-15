export function cutUrlFromText(text: string) {
    const urlRegex = /(https?:)?\/\/(www\.)?[-a-z0-9@:%._~#=]{1,256}\.[a-z0-9()]{1,6}\b([-a-z0-9()@:%_.~#?&/=]*)/i;

    return urlRegex.test(text)
        ? (() => {
            /* IIFE потому что не было смысла выносить это в отдельную функцию */
            let [link] = `${text}`.match(urlRegex);

            if (link.startsWith('//')) {
                link = link.replace(/^\/\//, 'https://');
            }

            return link;
        })()
        : text;
}
