import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    HostBinding,
    OnInit,
    ViewEncapsulation,
    inject,
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
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { LanguageToIsoCodePipe } from '@app/shared/pipes/language-to-iso-code/language-to-iso-code.pipe';
import { ResourceIdType } from '@app/shared/types/resource-id.type';
import { ShikivideosInterface } from '@app/shared/types/shikicinema/v1';
import { getContributionsAction } from '@app/modules/contributions/store/actions/get-contributions.actions';
import { getUploaderAction } from '@app/modules/contributions/store/actions/get-uploader.actions';
import {
    selectContributions,
    selectUploaderId,
} from '@app/modules/contributions/store/selectors/contributions.selectors';
import { trackById } from '@app/shared/utils/common-ngfor-tracking';


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
        LanguageToIsoCodePipe,
    ],
    templateUrl: 'contributions.page.html',
    styleUrl: 'contributions.page.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributionsPage implements OnInit {
    @HostBinding('class.contributions-page')
    private contributionsPageClass = true;

    private readonly route = inject(ActivatedRoute);
    private readonly store = inject(Store);
    private readonly title = inject(Title);
    private readonly transloco = inject(TranslocoService);
    private readonly destroyRef = inject(DestroyRef);

    readonly trackById = trackById;

    uploaderName$: Observable<string>;
    uploaderId$: Observable<ResourceIdType>;
    contributions$: Observable<ShikivideosInterface[]>;

    ngOnInit(): void {
        this.uploaderId$ = this.store.select(selectUploaderId);
        this.contributions$ = this.store.select(selectContributions);

        this.uploaderName$ = this.route.queryParams.pipe(
            map((params) => params.uploader),
        );

        this.uploaderName$
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                debounceTime(500),
                tap((uploader) => this.title.setTitle(
                    this.transloco.translate('CONTRIBUTIONS_MODULE.CONTRIBUTIONS_PAGE.PAGE_TITLE', { uploader }),
                )),
                tap((uploaderName) => this.store.dispatch(getUploaderAction({ uploaderName }))),
            )
            .subscribe();

        this.uploaderId$
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                filter(Boolean),
                tap((uploaderId) => this.store.dispatch(getContributionsAction({ uploaderId }))),
            )
            .subscribe();
    }
}
