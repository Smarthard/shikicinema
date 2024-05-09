import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { AnimeFranchiseNode, AnimeFranchiseLink } from '../../../types/franchise';
import { FranchiseService } from '../../../services/franchise/franchise.service';

@Component({
  selector: 'app-franchise-list',
  templateUrl: './franchise-list.component.html',
  styleUrls: ['./franchise-list.component.css']
})
export class FranchiseListComponent implements OnInit {

  franchiseData: AnimeFranchiseNode[] = [];
  relationData: AnimeFranchiseLink[] = [];
  showFranchiseList = false;
  isHidden = true;
  currentAnimeId: number;
  franchiseHovered: string | null = null;
  graphql: any
  dataFetched = false;
  isLoadingData = false;

  constructor(
    private franchiseService: FranchiseService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  readonly currentAnimeId$ = this.route.params.pipe(
    map(params => +params.animeId),
    distinctUntilChanged()
  );

  ngOnInit(): void {
    this.subscribeToAnimeId();
    if (!this.dataFetched) {
      this.fetchAndProcessFranchiseData();
    }
  }


  private subscribeToAnimeId(): void {
    this.currentAnimeId$.subscribe((animeId: number) => {
      this.currentAnimeId = animeId;
    });
  }

  // Получаем данные о франшизе
  private async fetchAndProcessFranchiseData(): Promise<void> {
    const data = await this.franchiseService.fetchFranchiseData();
    if (data) { 
      this.isHidden = false;
      this.franchiseData = this.processFranchiseData(data.nodes, data.links);
      this.dataFetched = true;
    }
  }

  // Маппим и фильтруем чтобы приквелы стояли спереди
  private processFranchiseData(nodes: any[], links: AnimeFranchiseLink[]): AnimeFranchiseNode[] {
    let franchiseData: AnimeFranchiseNode[] = nodes.map(node => ({
      id: node.id,
      name: node.name,
      poster: node.image_url,
      year: node.year === null ? 'Анонс' : node.year,
      kind: node.kind === null ? 'Анонс' : node.kind,
      status: '',
    }));
    franchiseData.reverse();
    franchiseData.forEach(node => {
      const nodeID = node.id;
      const relatedLinks: AnimeFranchiseLink[] = links.map(link => link.source_id === nodeID ? link : null).filter(Boolean);
      relatedLinks.forEach(link => {
        if (link.relation === 'prequel') {
          const targetID = link.target_id;
          const targetIndex = franchiseData.findIndex(item => item.id === targetID);
          const sourceIndex = franchiseData.findIndex(item => item.id === nodeID);
          if (targetIndex !== -1 && sourceIndex !== -1 && targetIndex > sourceIndex) {
            const targetItem = franchiseData.splice(targetIndex, 1)[0];
            franchiseData.splice(sourceIndex, 0, targetItem);
          }
        }
      });
    });
    return franchiseData
  }

  // Переход по тайтлам из франшизы
  async openFranchise(animeId: number): Promise<void> {
    const AnimeInfo = await this.franchiseService.GetEpisode(animeId);
    const maxEpisode = AnimeInfo.episodes || AnimeInfo.episodes_aired || 1;
    const watched = +(AnimeInfo.user_rate ? AnimeInfo.user_rate.episodes : 0);
    let episode = AnimeInfo.user_rate && AnimeInfo.user_rate.status === 'completed' ? 1 : watched + 1;

    if (episode > maxEpisode) {
      episode = maxEpisode;
    }
    this.router.navigate([`/${animeId}/${episode}`]);
    this.showFranchiseList = !this.showFranchiseList;
  }

  // Открытие и закрытие списка + подгружаем userRates для отметок
  async toggleFranchiseList(): Promise<any> {
    this.showFranchiseList = !this.showFranchiseList;
    if (!this.graphql) {
      this.isLoadingData = true;
      this.graphql = await this.franchiseService.GraphQL();
      this.franchiseData.forEach(franchise => {
        const matchedAnime = this.graphql.animes.find(anime => anime.id === franchise.id.toString());
        if (matchedAnime && matchedAnime.userRate !== null) {
          franchise.status = matchedAnime.userRate.status;
        }
      });
      this.isLoadingData = false;
    }
  }
}
