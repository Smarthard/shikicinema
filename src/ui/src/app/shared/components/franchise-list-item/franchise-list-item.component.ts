import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {map, distinctUntilChanged} from 'rxjs/operators';
import {AnimeFranchiseNode} from '../../../types/franchise';

@Component({
  selector: 'app-franchise-list-item',
  templateUrl: './franchise-list-item.component.html',
  styleUrls: ['./franchise-list-item.component.css']
})

export class FranchiseListItemComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
  ) {}

  currentAnimeId: number;
  franchiseHovered: number;

  readonly currentAnimeId$ = this.route.params.pipe(
    map(params => +params.animeId),
    distinctUntilChanged()
  );

  @Input() isLoadingData!: boolean;
  @Input() franchiseData!: AnimeFranchiseNode[];
  @Output() openFranchise = new EventEmitter<number>();

  ngOnInit(): void {
    this.currentAnimeId$.subscribe((animeId: number) => {
      this.currentAnimeId = animeId;
    });
  }
}
