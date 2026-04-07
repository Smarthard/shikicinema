import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    computed,
    model,
} from '@angular/core';
import { translateSignal } from '@jsverse/transloco';

@Component({
    selector: 'app-inline-expander',
    imports: [],
    templateUrl: './inline-expander.component.html',
    styleUrl: './inline-expander.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[tabindex]': 'isOpen() ? -1 : 0',
        'class': 'inline-expander',
        '[class.inline-expander--open]': 'isOpen()',
        '[class.inline-expander--closed]': '!isOpen()',
        '(click)': 'onExpand($event)',
        '(keydown.enter)': 'onExpand($event)',
        '(keydown.space)': 'onExpand($event)',
    },
})
export class InlineExpanderComponent {
    readonly isOpen = model(false);

    readonly actionText = computed(() => `GLOBAL.INLINE_EXPANDER.${this.isOpen() ? 'CLOSE' : 'OPEN'}`);
    readonly action = translateSignal(this.actionText);

    onExpand(event: Event): void {
        const isClosed = !this.isOpen();

        if (isClosed) {
            this.onToggle(event);
        }
    }

    onToggle(event: Event): void {
        event.stopPropagation();

        this.isOpen.set(!this.isOpen());
    }
}
