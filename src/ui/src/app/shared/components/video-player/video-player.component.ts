import {Component, Input, OnInit} from '@angular/core';
import {SafeUrl} from '@angular/platform-browser';
import {interval} from 'rxjs';
import {SmarthardNet} from '../../../types/smarthard-net';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit {

  readonly timeout$ = interval(3500);

  @Input()
  public videoUrl: SafeUrl;

  @Input()
  public video: SmarthardNet.Shikivideo;

  constructor() { }

  ngOnInit() {}

}
