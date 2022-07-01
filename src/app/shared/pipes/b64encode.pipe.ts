import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'b64encode',
    pure: true,
})
export class B64encodePipe implements PipeTransform {
    transform(value: string): unknown {
        return btoa(encodeURIComponent(value));
    }
}
