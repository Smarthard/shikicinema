import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    ViewEncapsulation,
} from '@angular/core';

import { SkeletonBlockModule } from '@app/shared/components/skeleton-block/skeleton-block.module';
import { UrlSanitizerPipe } from '@app/shared/pipes/url-sanitizer/url-sanitizer.pipe';

@Component({
    selector: 'app-player',
    standalone: true,
    imports: [
        UrlSanitizerPipe,
        SkeletonBlockModule,
    ],
    templateUrl: './player.component.html',
    styleUrl: './player.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerComponent {
    @HostBinding('class.player')
    private playerClass = true;

    @Input()
    loading = true;

    @Input()
    source: string;
}
