import { Pipe, PipeTransform } from '@angular/core';
import { mapLanguageToIsoCode } from '@app/shared/utils/map-language-to-iso-code.function';

@Pipe({
    name: 'languageToIsoCode',
    pure: true,
    standalone: true,
})
export class LanguageToIsoCodePipe implements PipeTransform {
    transform(language: string): string {
        return mapLanguageToIsoCode(language);
    }
}
