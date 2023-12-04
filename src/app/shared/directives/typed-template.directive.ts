/* eslint-disable @angular-eslint/directive-selector */
import { Directive, Input, TemplateRef } from '@angular/core';

/**
 * @see: https://stackoverflow.com/a/68318283
 */
@Directive({ selector: 'ng-template[templateType]' })
export class TypedTemplateDirective<T> {
    @Input()
    templateType: T;

    constructor(private _templateRef: TemplateRef<T>) {}

    static ngTemplateContextGuard<T>(
        dir: TypedTemplateDirective<T>,
        ctx: unknown,
    ): ctx is T {
        return true;
    }
}
