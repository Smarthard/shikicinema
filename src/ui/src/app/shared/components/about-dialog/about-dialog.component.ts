import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-about-dialog',
  templateUrl: './about-dialog.component.html',
  styleUrls: ['./about-dialog.component.css']
})
export class AboutDialogComponent implements OnInit {

  readonly VERSION = chrome.runtime.getManifest().version;
  readonly IS_PRODUCTION = environment.production;

  constructor(
    private dialogRef: MatDialogRef<AboutDialogComponent>
  ) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

}
