import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'makeEmptyArray',
    standalone: true,
    pure: true,
})
export class MakeEmptyArrayPipe implements PipeTransform {
    transform(count: number): Array<number> {
        return new Array(count).fill(0);
    }
}
