import { PreferencesValueType } from '@app/store/settings/types';

/** Cleans author strings from texts in parentheses e.g. "AniDUB (JAM)" -> "AniDUB"
 *
 * @param {String} author author name
 * @param {String} defaultAuthor author name if original cannot be shown
 * @return {String} cleaned author name
 */
export function cleanAuthorName(author: PreferencesValueType<string>, defaultAuthor = ''): string {
    if (typeof author === 'string') {
        const [, resolvedAuthor] = /(.*?)(\s\(.*\))?$/.exec(author) ?? [];

        return resolvedAuthor ?? author;
    } else {
        return defaultAuthor;
    }
}
