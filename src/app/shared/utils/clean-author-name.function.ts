/** Cleans author strings from texts in parentheses e.g. "AniDUB (JAM)" -> "AniDUB"
 *
 * @param {String} author author name
 * @return {String} cleaned author name
 */
export function cleanAuthorName(author: string): string {
    const [, resolvedAuthor] = /(.*?)(\s\(.*\))?$/.exec(author);

    return resolvedAuthor;
}
