import { FormControl } from '@angular/forms';

export function urlValidator() {
    return (control: FormControl<string>) => {
        try {
            new URL(control?.value);
        } catch (e) {
            return { isNotUrl: true };
        }

        return null;
    };
}
