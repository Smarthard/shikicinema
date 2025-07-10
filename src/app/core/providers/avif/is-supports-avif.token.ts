import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const IS_SUPPORTS_AVIF = new InjectionToken<Observable<boolean>>('IS_SUPPORTS_AVIF');
