export interface KodikTranslationInterface {
    id: number;

    /** Anime's author
     *
     * e.g. 'Сербин' */
    title: string;

    /** Anime's kind */
    type: 'voice' | 'subtitles';
}
