export function cutUrlFromText(text: string) {
    const urlRegex = /(https?:)?\/\/(www\.)?[-a-z0-9@:%._~#=]{1,256}\.[a-z0-9()]{1,6}\b([-a-z0-9()@:%_.~#?&/=]*)/i;

    return urlRegex.test(text)
        ? (() => {
            /* IIFE потому что не было смысла выносить это в отдельную функцию */
            const match = `${text}`.match(urlRegex);
            const [link] = match || [];

            if (!link) {
                return text;
            }

            if (link.startsWith('//')) {
                const fixedLink = link.replace(/^\/\//, 'https://');

                return fixedLink;
            }

            return link;
        })()
        : text;
}
