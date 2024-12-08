import { FormControl } from '@angular/forms';

export function NoWhitespacesValidator() {
    return (control: FormControl<string>) => {
        const hasWhitespacesOnly = !(control.value || '').trim();

        return hasWhitespacesOnly ? { hasWhitespacesOnly: true } : null;
    };
}
