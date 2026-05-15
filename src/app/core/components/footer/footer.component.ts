import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    inject,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslocoPipe } from '@jsverse/transloco';

import { ShikicinemaMetaService } from '@app/core/services/shikicinema-meta.service';
import { selectShikimoriDomain } from '@app/store/shikimori/selectors';

@Component({
    selector: 'app-footer',
    imports: [
        TranslocoPipe,
    ],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'footer',
    },
})
export class FooterComponent {
    private readonly shikicinemaMeta = inject(ShikicinemaMetaService);
    private readonly store= inject(Store);

    readonly shikimoriDomain = this.store.selectSignal(selectShikimoriDomain);

    readonly version = this.shikicinemaMeta.getAppVersion();
}
