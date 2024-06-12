/** Cleans author strings from texts in parentheses e.g. "AniDUB (JAM)" -> "AniDUB"
 *
 * @param {String} author author name
 * @param {String} defaultAuthor author name if original cannot be shown
 * @return {String} cleaned author name
 */
export function cleanAuthorName(author: string, defaultAuthor = ''): string {
    if (author) {
        const [, resolvedAuthor] = /(.*?)(\s\(.*\))?$/.exec(author);

        return resolvedAuthor ?? author;
    } else {
        return defaultAuthor;
    }
}
