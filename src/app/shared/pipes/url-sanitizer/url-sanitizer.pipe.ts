import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Pipe, PipeTransform, inject } from '@angular/core';

@Pipe({
    name: 'urlSanitizer',
    pure: true,
    standalone: true,
})
export class UrlSanitizerPipe implements PipeTransform {
    private sanitizer = inject(DomSanitizer);

    transform(url: string | URL): SafeUrl {
        const asString = url instanceof URL ? url.toString() : url;

        return this.sanitizer.bypassSecurityTrustResourceUrl(asString);
    }
}
