import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation,
} from '@angular/core';

@Component({
    template: '',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class AbstractImageCardComponent {
    @Input()
    imageUrl: string;

    @Input()
    name: string;

    @Input()
    height: string;

    @Input()
    width: string;

    @Input()
    backgroundSize: string;

    @Output()
    imageLoad = new EventEmitter<HTMLImageElement>();

    isLoading: boolean;

    protected onImageLoad(image: EventTarget): void {
        this.isLoading = false;
        this.imageLoad.emit(image as HTMLImageElement);
    }
}
