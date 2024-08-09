/* LICENSE: CC BY-SA 4.0 https://stackoverflow.com/a/67553519 */
import {
    Directive,
    EventEmitter,
    HostListener,
    Output,
} from '@angular/core';

@Directive({
    selector: '[appSwipe]',
    standalone: true,
})
export class SwipeDirective {
    @Output() appSwipeRight = new EventEmitter<void>();
    @Output() appSwipeLeft = new EventEmitter<void>();

    swipeCoord = [0, 0];
    swipeTime = new Date().getTime();

    @HostListener('touchstart', ['$event']) onSwipeStart($event) {
        this.onSwipe($event, 'start');
    }

    @HostListener('touchend', ['$event']) onSwipeEnd($event) {
        this.onSwipe($event, 'end');
    }

    onSwipe(e: TouchEvent, when: string) {
        this.swipe(e, when);
    }

    swipe(e: TouchEvent, when: string): void {
        const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
        const time = new Date().getTime();

        if (when === 'start') {
            this.swipeCoord = coord;
            this.swipeTime = time;
        } else if (when === 'end') {
            const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
            const duration = time - this.swipeTime;

            if (duration < 1000 &&
                Math.abs(direction[0]) > 30 &&
                Math.abs(direction[0]) > Math.abs(direction[1] * 3)) {
                const swipeDir = direction[0] < 0 ? 'next' : 'previous';

                if (swipeDir === 'next') {
                    this.appSwipeRight.emit();
                } else {
                    this.appSwipeLeft.emit();
                }
            }
        }
    }
}
