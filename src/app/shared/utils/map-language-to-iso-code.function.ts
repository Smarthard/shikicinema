import { VideoLanguageEnum } from '@app/modules/player/types';

export function mapLanguageToIsoCode(lang: string) {
    switch (lang) {
        case VideoLanguageEnum.Russian:
            return 'ru';
        case VideoLanguageEnum.Ukranian:
            return 'uk';
        case VideoLanguageEnum.Belarussian:
            return 'be';
        case VideoLanguageEnum.Kazakh:
            return 'kk';
        case VideoLanguageEnum.English:
            return 'en';
        case VideoLanguageEnum.Japanese:
            return 'ja';
        case VideoLanguageEnum.Chinese:
            return 'zh';
        case VideoLanguageEnum.Korean:
            return 'ko';
        default:
            return lang;
    }
}
