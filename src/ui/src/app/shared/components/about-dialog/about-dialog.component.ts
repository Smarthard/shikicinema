import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {environment} from '../../../../environments/environment';
import {ShikivideosService} from '../../../services/shikivideos-api/shikivideos.service';
import {interval} from 'rxjs';
import {ShikimoriService} from '../../../services/shikimori-api/shikimori.service';

@Component({
  selector: 'app-about-dialog',
  templateUrl: './about-dialog.component.html',
  styleUrls: ['./about-dialog.component.css']
})
export class AboutDialogComponent implements OnInit {

  readonly VERSION = chrome.runtime.getManifest().version;
  readonly IS_PRODUCTION = environment.production;
  readonly releaseNotes$ = this.shikivideos.getReleaseNotes(this.VERSION);
  readonly shikimoriUrl$ = this.shikimori.domain$;
  readonly timeout$ = interval(2000);

  constructor(
    private shikivideos: ShikivideosService,
    private shikimori: ShikimoriService,
    private dialogRef: MatDialogRef<AboutDialogComponent>
  ) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

}
