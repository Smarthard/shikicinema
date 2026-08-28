import { AbstractControl, ValidationErrors } from '@angular/forms';

export function NoWhitespacesValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
        const hasWhitespacesOnly = !(control.value || '').trim();

        return hasWhitespacesOnly ? { hasWhitespacesOnly: true } : null;
    };
}
