import { FormArray, FormControl } from '@angular/forms';

export function mapAnimeStatusOrderToFormArray(statusesOrder: string[] = []): FormArray<FormControl<string | null>> {
    const controls = statusesOrder.map((status) => new FormControl<string>(status));

    return new FormArray(controls);
}
