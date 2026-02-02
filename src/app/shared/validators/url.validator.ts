import { FormControl } from '@angular/forms';

export function urlValidator() {
    return (control: FormControl<string>) => {
        try {
            new URL(control?.value);
        } catch (_e) {
            return { isNotUrl: true };
        }

        return null;
    };
}
