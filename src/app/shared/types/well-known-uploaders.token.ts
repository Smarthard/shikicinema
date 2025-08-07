import { InjectionToken } from '@angular/core';

import { WellKnownType } from '@app/shared/types/well-known-uploaders.type';

export const WELL_KNOWN_UPLOADERS_TOKEN = new InjectionToken<WellKnownType>('KNOWN_UPLOADERS_TOKEN');
