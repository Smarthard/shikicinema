import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'b64decode',
    pure: true,
})
export class B64decodePipe implements PipeTransform {
    transform(value: string): unknown {
        return decodeURIComponent(atob(value));
    }
}
