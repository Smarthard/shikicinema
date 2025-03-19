import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    IonCol,
    IonContent,
    IonGrid,
    IonRow,
    IonText,
} from '@ionic/angular/standalone';
import {
    Observable,
    debounceTime,
    filter,
    map,
    tap,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { ResourceIdType } from '@app/shared/types/resource-id.type';
import { ShikivideosInterface } from '@app/shared/types/shikicinema/v1';
import { getContributionsAction } from '@app/modules/contributions/store/actions/get-contributions.actions';
import { getUploaderAction } from '@app/modules/contributions/store/actions/get-uploader.actions';
import {
    selectContributions,
    selectUploaderId,
} from '@app/modules/contributions/store/selectors/contributions.selectors';
import { trackById } from '@app/shared/utils/common-ngfor-tracking';


@UntilDestroy()
@Component({
    selector: 'app-contributions',
    standalone: true,
    imports: [
        AsyncPipe,
        TranslocoPipe,
        UpperCasePipe,
        TitleCasePipe,
        RouterLink,
        IonContent,
        IonGrid,
        IonRow,
        IonCol,
        IonText,
    ],
    templateUrl: 'contributions.page.html',
    styleUrl: 'contributions.page.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributionsPage implements OnInit {
    readonly trackById = trackById;

    uploaderName$: Observable<string>;
    uploaderId$: Observable<ResourceIdType>;
    contributions$: Observable<ShikivideosInterface[]>;

    constructor(
        private readonly _route: ActivatedRoute,
        private readonly _store: Store,
        private readonly _title: Title,
        private readonly _transloco: TranslocoService,
    ) {}

    ngOnInit(): void {
        this.uploaderId$ = this._store.select(selectUploaderId);
        this.contributions$ = this._store.select(selectContributions);

        this.uploaderName$ = this._route.queryParams.pipe(
            map((params) => params.uploader),
        );

        this.uploaderName$
            .pipe(
                untilDestroyed(this),
                debounceTime(500),
                tap((uploader) => this._title.setTitle(
                    this._transloco.translate('CONTRIBUTIONS_MODULE.CONTRIBUTIONS_PAGE.PAGE_TITLE', { uploader }),
                )),
                tap((uploaderName) => this._store.dispatch(getUploaderAction({ uploaderName }))),
            )
            .subscribe();

        this.uploaderId$
            .pipe(
                untilDestroyed(this),
                filter(Boolean),
                tap((uploaderId) => this._store.dispatch(getContributionsAction({ uploaderId }))),
            )
            .subscribe();
    }
}
