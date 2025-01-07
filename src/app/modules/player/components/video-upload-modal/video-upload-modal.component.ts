import { AsyncPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
    Input,
    NgZone,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {
    IonButton,
    IonInput,
    IonItem,
    IonModal,
    IonSelect,
    IonSelectOption,
    ModalController,
} from '@ionic/angular/standalone';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged, tap } from 'rxjs';

import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { PlayerComponent } from '@app/modules/player/components/player/player.component';
import { ResourceStateEnum } from '@app/shared/types/resource-state.enum';
import { ResourceStateValidator } from '@app/shared/validators/resource-state.validator';
import {
    VideoInfoInterface,
    VideoKindEnum,
    VideoLanguageEnum,
    VideoQualityEnum,
} from '@app/modules/player/types';
import { getAnimeName } from '@app/shared/utils/get-anime-name.function';
import { getLastAiredEpisode } from '@app/modules/player/utils';


@UntilDestroy()
@Component({
    selector: 'app-video-upload-modal',
    standalone: true,
    imports: [
        IonItem,
        IonInput,
        IonButton,
        IonSelect,
        IonSelectOption,
        AsyncPipe,
        TranslocoPipe,
        FormsModule,
        ReactiveFormsModule,
        PlayerComponent,
    ],
    templateUrl: './video-upload-modal.component.html',
    styleUrl: './video-upload-modal.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoUploadModalComponent extends IonModal implements OnInit {
    @HostBinding('class.video-upload-modal')
    private videoUploadModalClass = true;

    private _episode: number;

    @Input()
    anime: AnimeBriefInfoInterface;

    @Input()
    set episode(episode: number) {
        this._episode = episode;
    }

    get episode(): number {
        return this._episode;
    }

    uploadForm: FormGroup;

    get url(): string {
        return this.uploadForm.get('url').value;
    }

    readonly getAnimeName = getAnimeName;
    readonly getLastAiredEpisode = getLastAiredEpisode;
    readonly VideoKindEnum = VideoKindEnum;
    readonly VideoQualityEnum = VideoQualityEnum;
    readonly VideoLanguageEnum = VideoLanguageEnum;
    readonly lang$ = this.transloco.langChanges$;

    // TODO: инжект ModalController - костыль, нужно убрать вместе со всем конструктором (см. нижнее todo)
    constructor(
        readonly transloco: TranslocoService,
        private readonly _modalController: ModalController,
        private readonly _changeDetectorRef: ChangeDetectorRef,
        private readonly _elementRef: ElementRef,
        private readonly _zone: NgZone,
    ) {
        super(_changeDetectorRef, _elementRef, _zone);
    }

    ngOnInit(): void {
        this.uploadForm = new FormGroup({
            url: new FormControl('', [Validators.required]),
            urlState: new FormControl(ResourceStateEnum.INIT, [ResourceStateValidator()]),
            author: new FormControl(''),
            episode: new FormControl(this.episode, [Validators.required]),
            kind: new FormControl<VideoKindEnum>(VideoKindEnum.DUBBING),
            quality: new FormControl<VideoQualityEnum>(VideoQualityEnum.UNKNOWN),
            // TODO: использовать системный язык пользователя
            language: new FormControl<VideoLanguageEnum>(VideoLanguageEnum.Russian),
            urlType: new FormControl<string>({ value: 'iframe', disabled: true }),
        });

        this.uploadForm.get('url').valueChanges
            .pipe(
                distinctUntilChanged(),
                tap(() => this.onUrlLoadReset()),
                untilDestroyed(this),
            )
            .subscribe();
    }

    onUrlLoadReset(): void {
        this.uploadForm.get('urlState').patchValue(ResourceStateEnum.LOADING);
    }

    onUrlLoad(isLoaded: boolean): void {
        const status = isLoaded ? ResourceStateEnum.LOAD_SUCCESS : ResourceStateEnum.LOAD_FAILED;

        this.uploadForm.get('urlState').patchValue(status);
    }

    cancel() {
        // TODO: выяснить почему this.dismiss() кидает ошибку
        this._modalController.dismiss(null, 'cancel');
    }

    submit() {
        const { value } = this.uploadForm;

        this._modalController.dismiss(value as VideoInfoInterface, 'submit');
    }
}
