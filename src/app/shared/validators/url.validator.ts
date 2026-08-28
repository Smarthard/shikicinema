import { AbstractControl, ValidationErrors } from '@angular/forms';

export function urlValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl) => {
        const value = control.value;

        if (!value) return null;

        try {
            new URL(value);
        } catch (_e) {
            return { isNotUrl: true };
        }

        return null;
    };
}
