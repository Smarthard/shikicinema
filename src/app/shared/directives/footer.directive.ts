import {
    AfterViewInit,
    ComponentRef,
    Directive,
    ViewContainerRef,
    inject,
} from '@angular/core';

import { FooterComponent } from '@app/core/components/footer/footer.component';


@Directive({
    selector: 'ion-content[appWithFooter]',
})
export class FooterDirective implements AfterViewInit {
    private readonly viewContainerRef = inject(ViewContainerRef);

    ngAfterViewInit() {
        const footerRef: ComponentRef<FooterComponent> = this.viewContainerRef.createComponent(FooterComponent);
        const hostElement: HTMLElement = this.viewContainerRef.element.nativeElement;

        hostElement.appendChild(footerRef.location.nativeElement);
    }
}
