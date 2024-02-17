import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'getUrlDomain',
    pure: true,
    standalone: true,
})
export class GetUrlDomainPipe implements PipeTransform {
    transform(url: string | URL): string {
        const asUrl = url instanceof URL ? url : new URL(url);

        return asUrl.hostname
            .split('.')
            .slice(-2)
            .join('.');
    }
}
