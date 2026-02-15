import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Pipe, PipeTransform, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { Comment } from '@app/shared/types/shikimori/comment';
import { selectShikimoriDomain } from '@app/store/shikimori/selectors';


@Pipe({
    name: 'bbToHtml',
    standalone: true,
    pure: true,
})
export class BbToHtmlPipe implements PipeTransform {
    private readonly _sanitizer = inject(DomSanitizer);
    private readonly store = inject(Store);

    private readonly SHIKIMORI = this.store.selectSignal(selectShikimoriDomain);

    private readonly bbCodesReplacementMap: Array<[RegExp, string]> = [
        // linebreak
        [/\n/g, '<br>'],

        // smileys: :-D :-P :-( :-o :) +_+ and other
        [/ (:-?[DP(]) /g, `<img class="smiley" title="$1" alt="$1" src="${this.SHIKIMORI()}/images/smileys/$1.gif">`],
        [/ :-o /g, `<img class="smiley" title=":-o" alt=":-o" src="${this.SHIKIMORI()}/images/smileys/:-o.gif">`],
        [/ :\) /g, `<img class="smiley" title=":)" alt=":)" src="${this.SHIKIMORI()}/images/smileys/:).gif">`],
        [/ \+_\+ /g, `<img class="smiley" title="+_+" alt="+_+" src="${this.SHIKIMORI()}/images/smileys/+_+.gif">`],
        [
            / :(.*?): /g,
            `<img class="smiley" title=":$1:" alt=":$1:" src="${this.SHIKIMORI()}/images/smileys/:$1:.gif">`,
        ],

        // common rich text formats like bold, underlined and so on
        [/\[b](.*?)\[\/b]/ig, '<b>$1</b>'],
        [/\[i](.*?)\[\/i]/ig, '<i>$1</i>'],
        [/\[u](.*?)\[\/u]/ig, '<u>$1</u>'],
        [/\[s](.*?)\[\/s]/ig, '<s>$1</s>'],

        // old dropdown spoiler
        [
            /\[spoiler_v1='?(.*?)'?](.*)\[\/spoiler_v1]/ig,
            `<div class="shc-spoiler" onclick="">
                <label>$1</label>
                <div class="content">
                    <div class="before"></div>
                    <div class="inner text">$2</div>
                    <div class="after"></div>
                </div>
            </div>`,
        ],

        // inline spoiler
        [/\|\|(.*?)\|\|/ig, '<button class="shc-inline-spoiler" onclick=""><span>$1</span></button>'],
        [/\[spoiler](.*)\[\/spoiler]/ig, '<button class="shc-inline-spoiler" onclick=""><span>$1</span></button>'],

        // block spoiler
        [
            /\[spoiler='?(.*?)'?](.*)\[\/spoiler]/ig,
            `<div class="shc-block-spoiler" onclick="">
                <button>$1</button>
                <div>$2</div>
            </div>`,
        ],

        // link
        [/\[url='?(.*?)'?](.*?)\[\/url]/ig, '<a class="shc-links" href="$1">$2</a>'],

        // image
        [
            /\[img](.*?)\[\/img]/ig,
            `<a class="shc-image">
                <img src="$1" alt="$1">
            </a>`,
        ],
        [
            /\[image=(.*?)]/ig,
            `<a class="shc-image">
                <img src="$1" alt="$1">
            </a>`,
        ],

        // reply or mention
        [
            /\[comment='?(.*?)'?](.*?)\[\/comment]/ig,
            '<a class="shc-links shc-reply" href="#comment-$1">@$2</a>',
        ],

        // quote
        [
            /\[quote=c(.*?);(.*?);(.*?)](.*?)\[\/quote]/ig,
            `<div class="shc-quote">
                <div class="quoteable">
                    <a class="shc-links b-user16" href="${this.SHIKIMORI()}/comments/$1">
                        <img src="${this.SHIKIMORI()}/system/users/x16/$2.png" alt="$3">
                        <span>$3</span>
                    </a>
                </div>$4
            </div>`,
        ],
        [
            /\[quote=(.*?)](.*?)\[\/quote]/ig,
            `<div class="shc-quote">
                <div class="quoteable">
                    <a class="shc-links bubbled b-user16">
                        <span>$1</span>
                    </a> написал:
                </div>$2
            </div>`,
        ],
    ];

    private _parseBb(comment: Comment): string {
        let parsed = `${comment?.html_body}`;

        for (const [regex, replacement] of this.bbCodesReplacementMap) {
            parsed = parsed.replace(regex, replacement);
        }

        return parsed;
    }

    transform(comment: Comment): SafeHtml {
        return this._sanitizer.bypassSecurityTrustHtml(this._parseBb(comment));
    }
}
