import { AsyncPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    computed,
    input,
    signal,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori';
import { FranchiseComponent } from '@app/modules/player/components/franchise/franchise.component';
import { GetShikimoriPagePipe } from '@app/shared/pipes/get-shikimori-page/get-shikimori-page.pipe';
import { ImageCardComponent } from '@app/shared/components/image-card';
import { InlineExpanderComponent } from '@app/shared/components/inline-expander';
import { ShikimoriAnimeLinkPipe } from '@app/shared/pipes/shikimori-anime-link/shikimori-anime-link.pipe';
import { ToUploaderPipe } from '@app/modules/player/pipes';
import { UploaderComponent } from '@app/modules/player/components/uploader/uploader.component';
import { VideoInfoInterface } from '@app/modules/player/types';
import { provideSmarthardNetImageLoader } from '@app/shared/providers';

@Component({
    selector: 'app-description',
    imports: [
        AsyncPipe,
        ShikimoriAnimeLinkPipe,
        GetShikimoriPagePipe,
        FranchiseComponent,
        ImageCardComponent,
        InlineExpanderComponent,
        UploaderComponent,
        ToUploaderPipe,
        TranslocoPipe,
    ],
    providers: [
        provideSmarthardNetImageLoader(),
    ],
    templateUrl: './description.component.html',
    styleUrl: './description.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'description',
    },
})
export class DescriptionComponent {
    readonly anime = input.required<AnimeBriefInfoInterface>();
    readonly animeName = input.required<string>();
    readonly video = input<VideoInfoInterface>();

    readonly id = computed(() => this.anime()?.id);
    readonly hasDescription = computed(() => Boolean(this.anime()?.description));
    readonly description = computed(() => this.anime()?.description_html);
    readonly image = computed(() => `https://smarthard.net/static/animes/${this.id()}.avif`);
    readonly uploader = computed(() => this.video()?.uploader);

    isOpen = signal(false);

    onExpand(): void {
        this.isOpen.set(true);
    }
}
