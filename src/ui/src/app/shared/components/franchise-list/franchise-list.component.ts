import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom, map, distinctUntilChanged } from 'rxjs';
import { ShikimoriService } from '../../../services/shikimori-api/shikimori.service';
import { FranchiseData } from '../../../types/franchise';
import { FranchiseService } from '../../../services/franchise/franchise.service';

@Component({
  selector: 'app-franchise-list',
  templateUrl: './franchise-list.component.html',
  styleUrls: ['./franchise-list.component.css']
})
export class FranchiseListComponent implements OnInit {
  
  franchiseData: FranchiseData[] = [];
  showFranchiseList = false;
  isHidden = true;
  currentAnimeId: number;
  franchiseHovered: string | null = null;
  franchise;

  constructor(
    private router: Router,
    private FranchiseServ: FranchiseService,
    private route: ActivatedRoute,
    private shikimori: ShikimoriService,
  ) {}

  readonly currentAnimeId$ = this.route.params.pipe(
    map((params) => +params.animeId),
    distinctUntilChanged()
  );

  ngOnInit(): void {
    this.currentAnimeId$.subscribe((animeId: number) => {
      this.currentAnimeId = animeId;
      this.fetchFranchise(this.currentAnimeId)
        .then(franchise => {
          this.franchise = franchise
          this.fetchFranchiseData()
        })
    });
  }

  private async fetchFranchiseData(): Promise<void> {
    const domain = await firstValueFrom(this.shikimori.domain$);
    if (this.franchise !== null && this.franchise !== 'undefined') {
      this.isHidden = false;
      const excludedIdsData = await this.FranchiseServ.fetchData();
      const excludedIds = this.parseNotAnimeIds(excludedIdsData, this.franchise);
      const graphqlUrl = `${domain}/api/graphql`;
      const query = `
      {
        animes(order: aired_on, franchise: "${this.franchise}", limit: 100, excludeIds: "${excludedIds}", status: "!anons") {
          id
          russian
          kind
          episodes
          episodesAired
          status
          userRate { status episodes  }
          airedOn { year }
          related { relationRu
            anime {
              id
            }
          } 
        }
      }
    `;
    
      const response = await fetch(graphqlUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ query })
      });
    
      const { data } = await response.json();
    
      if (data && data.animes) {
        let franchiseData: FranchiseData[] = data.animes.map((node: any) => ({
          id: parseInt(node.id, 10),
          name: node.russian,
          kind: this.translateKind(node.kind),
          episodes: node.episodes,
          episodesAired: node.episodesAired,
          status: node.status,
          user_status: node.userRate ? node.userRate.status : null,
          user_episodes: node.userRate ? node.userRate.episodes : null,
          year: node.airedOn.year,
          related: node.related,
        }));
        franchiseData.reverse();

        // Список исключений для франшиз (в которых ТВ сериал не должен быть первым в хронологии)
        const excludedFranchises: string[] = ['ginga_eiyuu_densetsu', 'gintama']; 
        if (!excludedFranchises.includes(this.franchise)) {
          const firstTVItem = franchiseData.find(node => node.kind === "ТВ");
          const index = franchiseData.indexOf(firstTVItem);
          if (firstTVItem && index !== 0) {
            franchiseData.splice(index, 1);
            franchiseData.unshift(firstTVItem);
          }
        }
        let hasMoves = false;
        let iterations = 0;
        do {
          hasMoves = false;
          const withPrehistory = franchiseData.filter(node => node.related.some(rel => rel.relationRu === "Предыстория"));
    
          withPrehistory.forEach(item => {
            const index = franchiseData.findIndex(node => node.id === item.id);
            const prehistory = item.related.find(rel => rel.relationRu === "Предыстория");
            if (prehistory) {
              const prehistoryIndex = franchiseData.findIndex(node => node.id === parseInt(prehistory.anime.id, 10));
              if (prehistoryIndex > index) {
                const prehistoryItem = franchiseData.splice(prehistoryIndex, 1)[0];
                franchiseData.splice(index, 0, prehistoryItem);
                hasMoves = true;
              }
            }
          });
          iterations++;
          if (iterations > franchiseData.length) {
            break;
          }
        } while (hasMoves);
    
        this.franchiseData = franchiseData;
        let e = 1;
        this.franchiseData.forEach((node: FranchiseData) => {
          if (node.kind === 'ТВ') {
            node.e = e++;
          }
        });
      }
    }
  }

  private translateKind(kind: string): string {
    switch (kind) {
      case 'tv':
        return 'ТВ';
      case 'pv':
        return 'Проморолик';
      case 'cm':
        return 'Реклама';
      case 'music':
        return 'Клип';
      case 'movie':
        return 'Фильм';
      case 'ova':
        return 'OVA';
      case 'ona':
        return 'ONA';
      case 'special':
        return 'Спецвыпуск';
      case 'tv_special':
        return 'TV Спецвыпуск';
      default:
        return kind;
    }
  }

  private parseNotAnimeIds(data: any[], franchise: string): number[] {
    const excludedIdsSet: Set<number> = new Set();
    for (const entry of data) {
      if (entry.neko_id === franchise) {
        const notAnimeIds = entry.filters?.not_anime_ids || [];
        for (const id of notAnimeIds) {
          excludedIdsSet.add(id);
        }
      }
    }
    return [...excludedIdsSet];
  }

  openFranchise(animeId: number, episodes: number, episodesAired: number, user_episodes: number, user_status: string): void {
    this.changeCurrentAnimeId(animeId)
    const maxEpisode = episodes || episodesAired || 1;
    const watched = +(user_episodes ? user_episodes : 0);
    let episode = user_episodes && user_status === 'completed' ? 1 : watched + 1;
    if (episode > maxEpisode) {
      episode = maxEpisode;
    }
    this.showFranchiseList = !this.showFranchiseList;
    this.router.navigateByUrl(`/${animeId}/${episode}`);
  }

  toggleFranchiseList(): void {
    this.showFranchiseList = !this.showFranchiseList;
  }

  changeCurrentAnimeId(animeId: number): void {
    this.currentAnimeId = animeId;
  }

  async fetchFranchise(animeId: number) {
    const anime = await this.shikimori.getAnime(animeId).toPromise();
    return anime.franchise
  }
}
