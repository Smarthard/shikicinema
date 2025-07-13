import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    input,
    output,
    signal,
} from '@angular/core';

@Component({
    template: '',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class AbstractImageCardComponent {
    imageUrl = input<string>();

    name = input<string>();

    height = input<string>();

    width = input<string>();

    backgroundSize = input<string>();

    imageLoad = output<HTMLImageElement>();

    protected isLoading = signal(true);

    protected onImageLoad(image: EventTarget): void {
        this.isLoading.set(false);
        this.imageLoad.emit(image as HTMLImageElement);
    }
}
