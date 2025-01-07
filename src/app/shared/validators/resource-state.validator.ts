import { FormControl } from '@angular/forms';

import { ResourceStateEnum } from '@app/shared/types/resource-state.enum';

export function ResourceStateValidator() {
    return (control: FormControl<ResourceStateEnum>) => {
        const isLoadFailed = control?.value !== ResourceStateEnum.LOAD_SUCCESS;

        return isLoadFailed ? { resourceLoadFail: true } : null;
    };
}
