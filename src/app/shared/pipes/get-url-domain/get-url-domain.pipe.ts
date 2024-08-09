import { Pipe, PipeTransform } from '@angular/core';

import { getDomain } from '@app/shared/utils/get-domain.function';

@Pipe({
    name: 'getUrlDomain',
    pure: true,
    standalone: true,
})
export class GetUrlDomainPipe implements PipeTransform {
    transform(url: string | URL): string {
        return getDomain(url);
    }
}
