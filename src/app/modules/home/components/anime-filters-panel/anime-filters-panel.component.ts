import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
    computed,
    effect,
    inject,
    model,
    output,
    signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    IonButton,
    IonCheckbox,
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonNote,
    IonPopover,
    IonRange,
    IonSearchbar,
    IonSpinner,
    IonToolbar,
} from '@ionic/angular/standalone';
import {
    IonRangeCustomEvent,
    IonSearchbarCustomEvent,
    SearchbarInputEventDetail,
} from '@ionic/core';
import { Store } from '@ngrx/store';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { UpperCasePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import {
    AnimeQueryFiltersInterface,
    ShikicinemaGenreKindEnum,
    ShikicinemaStudio,
    SortOrderType,
} from '@app/shared/types/shikicinema/v1';
import { ResourceIdType } from '@app/shared/types';
import { formatPreviewNote, getGenreName } from '@app/modules/home/utils';
import {
    loadGenresAction,
    loadStudiosAction,
    selectGenres,
    selectIsGenresLoading,
    selectIsStudiosLoading,
    selectStudios,
} from '@app/modules/home/store/anime-rates';

@Component({
    selector: 'app-anime-filter-panel',
    imports: [
        IonList,
        IonListHeader,
        IonItem,
        IonLabel,
        IonRange,
        IonIcon,
        IonButton,
        IonSpinner,
        IonToolbar,
        IonNote,
        IonPopover,
        IonContent,
        IonCheckbox,
        IonSearchbar,
        TranslocoPipe,
        UpperCasePipe,
        FormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './anime-filters-panel.component.html',
    styleUrls: ['./anime-filters-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'anime-filter-panel',
    },
})
export class AnimeFilterPanelComponent implements OnInit {
    private readonly store = inject(Store);
    private readonly transloco = inject(TranslocoService);

    private readonly GROUP_KINDS = Object.values(ShikicinemaGenreKindEnum);

    filters = model.required<AnimeQueryFiltersInterface>();
    filterChange = output<AnimeQueryFiltersInterface>();

    readonly genres = this.store.selectSignal(selectGenres);
    readonly studios = this.store.selectSignal(selectStudios);

    readonly isGenresLoading = this.store.selectSignal(selectIsGenresLoading);
    readonly isStudiosLoading = this.store.selectSignal(selectIsStudiosLoading);

    readonly currentLang = toSignal(this.transloco.langChanges$);

    readonly seasonOptions = ['winter', 'spring', 'summer', 'fall'];

    readonly sortOptions = [
        'score',
        'name',
        'user_score',
        'aired_on',
        'user_created',
        'user_updated',
    ];

    readonly kindOptions = [
        'tv',
        'movie',
        'ova',
        'ona',
        'special',
        'tv_special',
        'music',
        'pv',
    ];

    readonly statusOptions = [
        'anons',
        'ongoing',
        'released',
    ];

    readonly ageRatingOptions = [
        'g',
        'pg',
        'pg_13',
        'r',
        'r_plus',
        'rx',
    ];

    readonly minYear = signal(1980);
    readonly nextYear = signal(new Date().getFullYear() + 1);

    readonly genreSearch = signal('');
    readonly studioSearch = signal('');
    readonly selectedStudios = signal<ShikicinemaStudio[]>([]);

    readonly yearRange = signal({ lower: this.minYear(), upper: this.nextYear() });

    readonly scoreRange = signal({ lower: 0, upper: 10 });

    readonly isExtendedYears = signal(false);

    readonly genreGroups = computed(() => {
        const lang = this.currentLang();
        const search = this.genreSearch().toLocaleLowerCase();

        return this.GROUP_KINDS
            .map((kind) => ({
                kind,
                items: this.genres()
                    .filter((g) => g.kind === kind &&
                        (!search || getGenreName(g, lang).toLocaleLowerCase().includes(search)),
                    )
                    .sort((a, b) => getGenreName(a, lang).localeCompare(getGenreName(b, lang))),
            }))
            .filter((g) => g.items.length > 0);
    });

    readonly allStudios = computed(() => {
        const selected = this.selectedStudios();

        const rest = this.studios().filter(({ id }) => !this.selectedStudios().some((selected) => selected.id === id));
        return [...selected, ...rest];
    });

    readonly selectedGenresCount = computed(() => this.filters().genres?.length ?? 0);
    readonly genresPreviewNote = computed(() => formatPreviewNote(
        this.filters().genres,
        this.genres(),
        ({ name, russian }, language) => language === 'ru' ? russian : name,
        this.currentLang(),
    ));

    readonly selectedKindsCount = computed(() => this.filters().kinds?.length ?? 0);
    readonly kindsPreviewNote = computed(() => formatPreviewNote(
        this.filters().kinds,
        this.kindOptions,
        (kind) => this.transloco.translate(`GLOBAL.SHIKIMORI.ANIME_KINDS.${kind.toUpperCase()}`),
    ));

    readonly selectedStatusesCount = computed(() => this.filters().statuses?.length ?? 0);
    readonly statusesPreviewNote = computed(() => formatPreviewNote(
        this.filters().statuses,
        this.statusOptions,
        (status) => this.transloco.translate(`GLOBAL.SHIKIMORI.ANIME_STATUSES.${status.toUpperCase()}`),
    ));

    readonly selectedAgeRatingsCount = computed(() => this.filters().ageRatings?.length ?? 0);
    readonly ageRatingsPreviewNote = computed(() => formatPreviewNote(
        this.filters().ageRatings,
        this.ageRatingOptions,
        (ageRating) => this.transloco.translate(`GLOBAL.SHIKIMORI.AGE_RATINGS.${ageRating.toUpperCase()}`),
    ));

    readonly selectedStudiosCount = computed(() => this.filters().studios?.length ?? 0);
    readonly studiosPreviewNote = computed(() => formatPreviewNote(
        this.filters().studios,
        this.selectedStudios(),
        ({ name }) => name,
    ));

    readonly onFiltersChangeEffect = effect(() => this.filterChange.emit(this.filters()));
    readonly onStudioSearchEffect = effect(() => {
        const name = this.studioSearch();

        if (name) {
            this.store.dispatch(loadStudiosAction({ name }))
        }
    });

    ngOnInit(): void {
        if (!this.genres().length) {
            this.store.dispatch(loadGenresAction());
        }

        if (!this.studios().length) {
            this.store.dispatch(loadStudiosAction({ name: '' }));
        }
    }

    yearFormatter(value: number) {
        return `${value}`;
    }

    onSortChange(sort: string): void {
        const order: SortOrderType = sort === 'user_score' ? 'DESC' : 'ASC';

        this.filters.update((f) => ({ ...f, sort, order }));
    }

    toggleOrder(event: PointerEvent): void {
        event.stopPropagation();

        this.filters.update((f) => ({ ...f, order: f.order === 'DESC' ? 'ASC' : 'DESC' }));
    }

    onKindChange(kinds: string[]): void {
        this.filters.update((f) => ({ ...f, kinds }));
    }

    onStatusChange(statuses: string[]): void {
        this.filters.update((f) => ({ ...f, statuses }));
    }

    onAgeRatingChange(ageRatings: string[]): void {
        this.filters.update((f) => ({ ...f, ageRatings }));
    }

    onYearRangeChange(evt: IonRangeCustomEvent<any>): void {
        const { lower, upper } = evt.detail.value;
        const isMin = lower === this.minYear();
        const isMax = upper === this.nextYear();

        this.yearRange.set({
            lower,
            upper,
        });

        this.filters.update((f) => ({
            ...f,
            airedFrom: isMin ? undefined : lower,
            airedTo: isMax ? undefined : upper,
        }));
    }

    onGenresChange(genreIds: number[]): void {
        this.filters.update((f) => ({ ...f, genres: genreIds.length ? genreIds : undefined }));
    }

    toggleGenre(genreId: ResourceIdType): void {
        this.filters.update((f) => {
            const current = f.genres || [];
            const next = current.includes(genreId)
                ? current.filter((id) => id !== genreId)
                : [...current, genreId];

            return { ...f, genres: next.length ? next : undefined };
        });
    }

    onGenreSearch(event: IonSearchbarCustomEvent<SearchbarInputEventDetail>): void {
        const { value: search = '' } = event.detail;

        this.genreSearch.set(search as string);
    }

    toggleKind(kind: string): void {
        this.filters.update((f) => {
            const kinds = f.kinds || [];
            const next = kinds.includes(kind)
                ? kinds.filter((k) => k !== kind)
                : [...kinds, kind];
            return { ...f, kinds: next.length ? next : undefined };
        });
    }

    toggleStatus(status: string): void {
        this.filters.update((f) => {
            const statuses = f.statuses || [];
            const next = statuses.includes(status)
                ? statuses.filter((s) => s !== status)
                : [...statuses, status];
            return { ...f, statuses: next.length ? next : undefined };
        });
    }

    toggleAgeRating(ageRating: string): void {
        this.filters.update((f) => {
            const ageRatings = f.ageRatings || [];
            const next = ageRatings.includes(ageRating)
                ? ageRatings.filter((a) => a !== ageRating)
                : [...ageRatings, ageRating];
            return { ...f, ageRatings: next.length ? next : undefined };
        });
    }

    scoreFormatter(value: number) {
        return `${value}`;
    }

    toggleStudio(studio: ShikicinemaStudio): void {
        this.selectedStudios.update((s) => {
            const includes = s.find(({ id }) => id === studio.id);

            return includes
                ? s.filter(({ id }) => id !== studio.id)
                : [...s, studio];
        });

        this.filters.update((f) => {
            const studios = f.studios || [];
            const next = studios.includes(studio.id)
                ? studios.filter((s) => s !== studio.id)
                : [...studios, studio.id];

            return { ...f, studios: next.length ? next : undefined };
        });
    }

    onStudioSearch(event: any): void {
        this.studioSearch.set(event.detail.value);
    }

    onScoreRangeChange(event: IonRangeCustomEvent<any>): void {
        const { lower, upper } = event.detail.value;
        this.scoreRange.set({ lower, upper });
        this.filters.update((f) => ({
            ...f,
            scoreMin: lower > 0 ? lower : undefined,
            scoreMax: upper < 10 ? upper : undefined,
        }));
    }

    toggleExtendedYears(): void {
        const extended = !this.isExtendedYears();
        this.isExtendedYears.set(extended);
        const newMin = extended ? 1900 : 1980;
        this.minYear.set(newMin);
        this.yearRange.update((r) => ({ ...r, lower: newMin }));
    }

    onSeasonChange(season: string): void {
        this.filters.update((f) => ({ ...f, season: season || undefined }));
    }

    resetFilters(): void {
        this.filters.set({
            sort: 'user_score',
            order: 'DESC',
            genres: [],
            studios: [],
            kinds: [],
            statuses: [],
            ageRatings: [],
        });
        this.yearRange.set({ lower: this.minYear(), upper: this.nextYear() });
        this.scoreRange.set({ lower: 0, upper: 10 });
        this.minYear.set(1980);
    }
}
