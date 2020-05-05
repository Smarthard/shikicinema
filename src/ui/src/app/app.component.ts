import {Component, ElementRef, HostBinding, OnInit} from '@angular/core';
import {ThemesService} from './services/themes/themes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @HostBinding('class.dark-theme')
  darkClassBinding = false;

  constructor(
    private elementRef: ElementRef,
    private themesService: ThemesService
  ) {}

  ngOnInit(): void {
    this.themesService.theme$
      .subscribe((theme) => {
        this.darkClassBinding = theme === 'dark';
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = this.darkClassBinding ? '#2e2e2e' : null;
      });
  }
}
