import {Component, ElementRef, HostBinding, OnInit} from '@angular/core';
import {ThemesService} from './services/themes/themes.service';
import {ShikimoriDomainsService} from './services/shikimori-api/shikimori-domains.service';
import {ShikimoriService} from './services/shikimori-api/shikimori.service';

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
    private themesService: ThemesService,
    private shikimoriDomains: ShikimoriDomainsService,
    private shikimori: ShikimoriService,
  ) {}

  ngOnInit(): void {
    this.shikimoriDomains.detect('https://shikimori.one', 'https://shikimori.org', 'https://shikimori.me')
      .subscribe((domain) => this.shikimori.setShikimoriDomain(domain));

    this.themesService.theme$
      .subscribe((theme) => {
        this.darkClassBinding = theme === 'dark';
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = this.darkClassBinding ? '#2e2e2e' : null;
      });
  }
}
