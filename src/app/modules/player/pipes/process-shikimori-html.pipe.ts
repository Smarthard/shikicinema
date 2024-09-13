import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';

import { Comment } from '@app/shared/types/shikimori/comment';
import { environment } from '@app-env/environment';


@Pipe({
    name: 'processShikimoriHtml',
    standalone: true,
    pure: true,
})
export class ProcessShikimoriHtmlPipe implements PipeTransform {
    private readonly SHIKIMORI_URL = environment.shikimori.apiURI;

    private readonly htmlReplacementMap: Array<[RegExp, string]> = [
        // спойлеры, картинки и т.п. имеют мусорные классы - объединяем в единый интерактивный
        [/(unprocessed)|(to-process)|(check-width)/ig, 'shc-interactive'],
    ];

    // убираем мусор из html комментария
    private _cleanUp(comment: Comment): string {
        let parsed = `${comment?.html_body}`;

        for (const [regex, replacement] of this.htmlReplacementMap) {
            parsed = parsed.replace(regex, replacement);
        }

        return parsed;
    }

    // то, что не смогли почистить меняем вручную на нужное
    private _preprocess(html: string): string {
        const { body: processedHtml } = new DOMParser().parseFromString(html, 'text/html');

        // смайликам добавляем в src домен шикимори
        for (const smiley of Array.from(processedHtml.querySelectorAll('img.smiley'))) {
            const src = smiley.getAttribute('src');

            smiley.setAttribute('src', `${this.SHIKIMORI_URL}${src}`);
        }

        // вставки с видео заменяем с картинок на iframe'ы
        for (const video of Array.from(processedHtml.querySelectorAll('.video-link'))) {
            const parent = video.parentElement;
            const src = video.getAttribute('data-href');

            parent.insertAdjacentHTML('beforeend', `<iframe class="shc-iframe" src="${src}"></iframe>`);
            video.remove();
        }

        return processedHtml.innerHTML;
    }

    constructor(
        private readonly _sanitizer: DomSanitizer,
    ) {}

    transform(comment: Comment): SafeHtml {
        const parsed = this._cleanUp(comment);
        const processed = this._preprocess(parsed);

        return this._sanitizer.bypassSecurityTrustHtml(processed);
    }
}
