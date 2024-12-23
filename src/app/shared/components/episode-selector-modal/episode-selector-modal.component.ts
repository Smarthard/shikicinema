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
    IonButton,
    IonButtons,
    IonIcon,
    IonModal,
    IonPicker,
    IonPickerColumn,
    IonPickerColumnOption,
    IonTitle,
    IonToolbar,
    ModalController,
} from '@ionic/angular/standalone';

@Component({
    selector: 'app-episode-selector-modal',
    standalone: true,
    imports: [
        IonToolbar,
        IonTitle,
        IonButtons,
        IonButton,
        IonIcon,
        IonPicker,
        IonPickerColumn,
        IonPickerColumnOption,
    ],
    templateUrl: './episode-selector-modal.component.html',
    styleUrl: './episode-selector-modal.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpisodeSelectorModalComponent extends IonModal {
    @HostBinding('class.episode-selector-modal')
    private episodeSelectorModalClass = true;

    private _selected = 1;

    @Input({ required: true })
    episodes: number[];

    @Input()
    set selected(value: number) {
        this._selected = value;
    }

    get selected(): number {
        return this._selected;
    }

    // TODO: инжект ModalController - костыль, нужно убрать вместе со всем конструктором (см. нижнее todo)
    constructor(
        private readonly _modalController: ModalController,
        private readonly _changeDetectorRef: ChangeDetectorRef,
        private readonly _elementRef: ElementRef,
        private readonly _zone: NgZone,
    ) {
        super(_changeDetectorRef, _elementRef, _zone);
    }

    onSelectedChange(event: CustomEvent): void {
        const episode = event?.detail?.value;

        if (episode) {
            this._selected = episode;
        }
    }

    cancel(): void {
        // TODO: выяснить почему this.dismiss() кидает ошибку
        this._modalController.dismiss(null, 'cancel');
    }

    submit(selected: number): void {
        this._modalController.dismiss(selected, 'submit');
    }
}
