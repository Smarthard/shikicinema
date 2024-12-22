import { AsyncPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
    Input,
    NgZone,
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

import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { PlayerComponent } from '@app/modules/player/components/player/player.component';
import {
    VideoInfoInterface,
    VideoKindEnum,
    VideoLanguageEnum,
    VideoQualityEnum,
} from '@app/modules/player/types';
import { getAnimeName } from '@app/shared/utils/get-anime-name.function';
import { getLastAiredEpisode } from '@app/modules/player/utils';


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
export class VideoUploadModalComponent extends IonModal {
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

    uploadForm = new FormGroup({
        url: new FormControl('', [Validators.required]),
        author: new FormControl(''),
        episode: new FormControl(this.episode, [Validators.required]),
        kind: new FormControl<VideoKindEnum>(VideoKindEnum.DUBBING),
        quality: new FormControl<VideoQualityEnum>(VideoQualityEnum.UNKNOWN),
        // TODO: использовать системный язык пользователя
        language: new FormControl<VideoLanguageEnum>(VideoLanguageEnum.Russian),
        urlType: new FormControl<string>({ value: 'iframe', disabled: true }),
    });

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

    cancel() {
        // TODO: выяснить почему this.dismiss() кидает ошибку
        this._modalController.dismiss(null, 'cancel');
    }

    submit() {
        const { value } = this.uploadForm;

        this._modalController.dismiss(value as VideoInfoInterface, 'submit');
    }
}
