import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const SHIKIMORI_DOMAIN_TOKEN = new InjectionToken<Observable<string>>('SHIKIMORI_DOMAIN_TOKEN');
