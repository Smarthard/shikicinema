import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-oldfag-episodes-list-skeleton',
  templateUrl: './oldfag-episodes-list-skeleton.component.html',
  styleUrls: ['./oldfag-episodes-list-skeleton.component.css']
})
export class OldfagEpisodesListSkeletonComponent {

  @Input()
  public episodes = 30;

  constructor() { }

}
