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
    imageLoad = new EventEmitter<void>();

    isLoading: boolean;

    protected onImageLoad(): void {
        this.isLoading = false;
        this.imageLoad.emit();
    }
}
