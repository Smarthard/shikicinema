import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Shikivideo} from "../../../types/shikivideo";

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.css']
})
export class VideoListComponent implements OnInit {

  @Input()
  public videos: Shikivideo[] = [];

  @Output()
  public change: EventEmitter<Shikivideo> = new EventEmitter<Shikivideo>();

  constructor() { }

  ngOnInit() {
  }

}
