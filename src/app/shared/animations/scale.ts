import { AnimationTriggerMetadata, animate, state, style, transition, trigger } from '@angular/animations';

export function scale(scale = 1.05, inDuration = '150ms', outDuration = '50ms'): AnimationTriggerMetadata {
    return trigger('scale', [
        state('false', style({ scale: 1 })),
        state('true', style({ scale })),
        transition(':enter', animate(`${inDuration} ease-in-out`)),
        transition(':leave', animate(`${outDuration} ease-in-out`)),
    ]);
}
