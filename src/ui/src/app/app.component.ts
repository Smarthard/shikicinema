import {Component, OnInit} from '@angular/core';
import {AuthService} from './services/auth/auth.service';
import {timer} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private shikimoriTokenTimer$ = timer(0, 20 * 60 * 60 * 1000);

  constructor(
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.shikimoriTokenTimer$
      .pipe(
        switchMap(() => this.auth.shikimori$)
      )
      .subscribe(token => {
        if (token.resfresh && token.expired) {
          this.auth.shikimoriSync();
        }
      });
  }

}
