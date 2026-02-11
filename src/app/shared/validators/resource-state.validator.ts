import { Validator } from '@angular/forms/signals';

import { ResourceStateEnum } from '@app/shared/types/resource-state.enum';

export function ResourceStateValidator(): Validator<ResourceStateEnum> {
    return ({ value }) => {
        const isLoadFailed = value() !== ResourceStateEnum.LOAD_SUCCESS;

        return isLoadFailed
            ? { kind: 'resourceLoadFail' }
            : null;
    };
}
