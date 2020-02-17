import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {environment} from '../../../../environments/environment';
import {ShikivideosService} from '../../../services/shikivideos-api/shikivideos.service';

@Component({
  selector: 'app-about-dialog',
  templateUrl: './about-dialog.component.html',
  styleUrls: ['./about-dialog.component.css']
})
export class AboutDialogComponent implements OnInit {

  readonly VERSION = chrome.runtime.getManifest().version;
  readonly IS_PRODUCTION = environment.production;
  readonly releaseNotes$ = this.shikivideos.getReleaseNotes(this.VERSION);

  constructor(
    private shikivideos: ShikivideosService,
    private dialogRef: MatDialogRef<AboutDialogComponent>
  ) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

}
