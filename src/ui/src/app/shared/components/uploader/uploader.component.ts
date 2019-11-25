import {Component, Input, OnInit} from '@angular/core';
import {Shikimori} from '../../../types/shikimori';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit {

  @Input()
  public uploadedByUser: Shikimori.User;

  constructor() {}

  ngOnInit() {}

}
