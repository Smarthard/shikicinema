import { AsyncPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
    effect,
    inject,
    input,
    signal,
} from '@angular/core';
import {
    FormField,
    disabled,
    form,
    pattern,
    required,
    validate,
} from '@angular/forms/signals';
import {
    IonButton,
    IonInput,
    IonItem,
    IonModal,
    IonSelect,
    IonSelectOption,
    ModalController,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { PlayerComponent } from '@app/modules/player/components/player/player.component';
import { ResourceStateEnum } from '@app/shared/types/resource-state.enum';
import { ResourceStateValidator } from '@app/shared/validators/resource-state.validator';
import {
    VideoKindEnum,
    VideoLanguageEnum,
    VideoQualityEnum,
    VideoUploadFormInterface,
} from '@app/modules/player/types';
import { cutUrlFromText, getMaxEpisode } from '@app/modules/player/utils';
import { getAnimeName } from '@app/shared/utils/get-anime-name.function';
import { saveVideoUploadFormAction, selectVideoUploadForm } from '@app/store/cache';


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
        FormField,
        PlayerComponent,
    ],
    templateUrl: './video-upload-modal.component.html',
    styleUrl: './video-upload-modal.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'class': 'video-upload-modal',
    },
})
export class VideoUploadModalComponent extends IonModal implements OnInit {
    private readonly transloco = inject(TranslocoService);
    private readonly modalController = inject(ModalController);
    private readonly store = inject(Store);

    readonly previousForm = this.store.selectSignal(selectVideoUploadForm);

    readonly anime= input.required<AnimeBriefInfoInterface>();

    readonly episode = input.required<number>();

    readonly uploadModel = signal<VideoUploadFormInterface>({
        url: '',
        urlState: ResourceStateEnum.INIT,
        author: '',
        episode: 1,
        kind: VideoKindEnum.DUBBING,
        quality: VideoQualityEnum.UNKNOWN,
        // TODO: использовать системный язык пользователя
        language: VideoLanguageEnum.Russian,
        urlType: 'iframe',
    });

    readonly uploadForm = form(this.uploadModel, (path) => {
        required(path.url);
        pattern(path.url, /^https?:\/\//);

        validate(path.urlState, ResourceStateValidator());

        required(path.episode);

        disabled(path.urlType);
    });

    get url(): string {
        return this.uploadForm.url().value();
    }

    readonly getAnimeName = getAnimeName;
    readonly getMaxEpisode = getMaxEpisode;
    readonly VideoKindEnum = VideoKindEnum;
    readonly VideoQualityEnum = VideoQualityEnum;
    readonly VideoLanguageEnum = VideoLanguageEnum;
    readonly lang$ = this.transloco.langChanges$;

    readonly onUrlChangeEffect = effect(() => {
        this.uploadForm.url();
        this.onUrlLoadReset();
    })

    readonly onFormChangeEffect = effect(() => {
        if (this.uploadForm().valid()) {
            this.store.dispatch(saveVideoUploadFormAction({ form: this.uploadForm().value() }));
        }
    });

    ngOnInit(): void {
        this.uploadForm.episode().value.set(this.episode());

        if (this.previousForm()) {
            this.uploadForm().controlValue.set(this.previousForm());
        }
    }

    onUrlLoadReset(): void {
        this.uploadForm.urlState().value.set(ResourceStateEnum.LOADING);
    }

    onUrlLoad(isLoaded: boolean): void {
        const status = isLoaded ? ResourceStateEnum.LOAD_SUCCESS : ResourceStateEnum.LOAD_FAILED;

        this.uploadForm.urlState().value.set(status);
    }

    cancel(): void {
        // TODO: выяснить почему this.dismiss() кидает ошибку
        this.modalController.dismiss(null, 'cancel');
    }

    submit(): void {
        this.modalController.dismiss(this.uploadForm().value(), 'submit');
    }

    cutUrlFromClipboard(event: ClipboardEvent): void {
        const clipboardText = event.clipboardData.getData('text');
        const clipboardUrl = cutUrlFromText(clipboardText);

        // вставку текста без обработки отменяем
        event.preventDefault();

        this.uploadForm.url().value.set(clipboardUrl);
    }
}
