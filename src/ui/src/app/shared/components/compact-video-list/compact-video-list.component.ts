import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SmarthardNet} from '../../../types/smarthard-net';

@Component({
  selector: 'app-compact-video-list',
  templateUrl: './compact-video-list.component.html',
  styleUrls: ['./compact-video-list.component.css']
})
export class CompactVideoListComponent implements OnInit {

  @Input()
  public videos: SmarthardNet.Shikivideo[] = [];

  @Input()
  public chosenId: number;

  @Output()
  public change: EventEmitter<SmarthardNet.Shikivideo> = new EventEmitter<SmarthardNet.Shikivideo>();

  constructor() { }

  ngOnInit() {
  }

}
