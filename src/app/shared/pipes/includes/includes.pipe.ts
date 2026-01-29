import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'includes',
    pure: false,
    standalone: true,
})
export class IncludesPipe implements PipeTransform {
    transform<T>(array: ArrayLike<T>, value: T): boolean {
        return array instanceof Array
            ? array.includes(value)
            : Array.from(array)?.includes(value);
    }
}
