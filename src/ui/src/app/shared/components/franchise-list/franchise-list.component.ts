import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { FranchiseData, exceptionsFranchises } from '../../../types/franchise';
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
  skips: number;
  now: Date;

  constructor(
    private franchiseService: FranchiseService,
    private route: ActivatedRoute,
  ) { }

  readonly currentAnimeId$ = this.route.params.pipe(
    map(params => +params.animeId),
    distinctUntilChanged()
  );

  ngOnInit(): void {
    this.currentAnimeId$.subscribe((animeId: number) => {
      this.currentAnimeId = animeId;
      this.fetchAndProcessFranchiseData();
    });
  }

  private async fetchAndProcessFranchiseData(): Promise<void> {
    this.franchise = await this.franchiseService.fetchFranchise(this.currentAnimeId);
    if (this.franchise !== null) {
      this.isHidden = false;
      const data = await this.franchiseService.fetchAnimeData(this.franchise);
      if (data && data.animes) {
        let franchiseData: FranchiseData[] = this.processFranchiseData(data.animes);
        this.franchiseData = this.sortFranchiseData(franchiseData);
        this.addEpisodeNumbers();
      }
    }
  }

  private sortFranchiseData(franchiseData: FranchiseData[]): FranchiseData[] {
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

    return franchiseData;
  }


  private processFranchiseData(animes: any[]): FranchiseData[] {
    let franchiseData: FranchiseData[] = animes.map(anime => ({
      id: parseInt(anime.id, 10),
      name: anime.russian,
      kind: this.translateKind(anime.kind),
      episodes: anime.episodes,
      episodesAired: anime.episodesAired,
      status: anime.status,
      user_status: anime.userRate?.status || null,
      user_episodes: anime.userRate?.episodes || null,
      year: anime.airedOn.year,
      date: anime.airedOn.date,
      released: anime.releasedOn.date,
      related: anime.related,
    }));
    franchiseData.reverse();
    this.handleExceptions(franchiseData);
    return franchiseData;
  }

  private handleExceptions(franchiseData: FranchiseData[]): void {
    if (exceptionsFranchises.includes(this.franchise)) {
      const firstTVItem = franchiseData.find(node => node.kind === "ТВ");
      const index = franchiseData.indexOf(firstTVItem);
      if (firstTVItem && index !== 0) {
        franchiseData.splice(index, 1);
        franchiseData.unshift(firstTVItem);
      }
    }
  }

  private addEpisodeNumbers(): void {
    let episodeCounter = 1;
    this.franchiseData.forEach((currentNode: FranchiseData, currentIndex: number) => {
      if (currentNode.kind === 'ТВ') {
        const timeDifference = this.calculateTimeDifference(currentNode);
        currentNode.e = episodeCounter++;
        let nextIndex = currentIndex + 1;
        while (nextIndex < this.franchiseData.length) {
          const nextNode = this.franchiseData[nextIndex];
          if (nextNode.ep !== undefined) {
            break;
          }
          if (currentNode.year <= nextNode.year && nextNode.kind !== 'ТВ') {
            console.log(currentNode.name, nextNode.name)
            let weeksDifference = this.calculateWeekDifference(currentNode, nextNode, timeDifference);
            console.log(weeksDifference)
            if (currentNode.status === 'ongoing') {
              weeksDifference+=2
            }
            const hasEnoughEpisodes = weeksDifference <= (currentNode.status === 'ongoing' ? currentNode.episodesAired : currentNode.episodes);
            if (hasEnoughEpisodes) {
              nextNode.ep = weeksDifference;
              nextIndex++;
            } else {
              break;
            }
          } else {
            nextIndex++;
            continue;
          }
        }
      }
    });
  }

  private calculateTimeDifference(node: FranchiseData): number {
    const startDate = new Date(node.date);
    const endDate = node.status === 'ongoing' ? new Date() : new Date(node.released);
    const differenceInMs = endDate.getTime() - startDate.getTime();
    return differenceInMs / (604800000 * (node.status === 'ongoing' ? node.episodesAired : node.episodes));
  }

  private calculateWeekDifference(currentNode: FranchiseData, nextNode: FranchiseData, skips: number): number {
    const currentDate = new Date(currentNode.date);
    const nextDate = new Date(nextNode.date);
    const differenceInMs = nextDate.getTime() - currentDate.getTime();
    return Math.ceil(differenceInMs / (604800000 * skips)) ;
  }

  private translateKind(kind: string): string {
    const kindTranslations = {
      'tv': 'ТВ',
      'pv': 'Проморолик',
      'cm': 'Реклама',
      'music': 'Клип',
      'movie': 'Фильм',
      'ova': 'OVA',
      'ona': 'ONA',
      'special': 'Спецвыпуск',
      'tv_special': 'TV Спецвыпуск',
    };
    return kindTranslations[kind] || kind;
  }

  openFranchise(animeId: number, episodes: number, episodesAired: number, user_episodes: number, user_status: string): void {
    const PLAYER_URL = chrome.runtime.getURL('/index.html');
    const maxEpisode = episodes || episodesAired || 1;
    const watched = +(user_episodes ? user_episodes : 0);
    let episode = user_episodes && user_status === 'completed' ? 1 : watched + 1;
    episode = Math.min(episode, maxEpisode);
    window.location.href = `${PLAYER_URL}#/${animeId}/${episode}`;
    location.reload();
  }

  toggleFranchiseList(): void {
    this.showFranchiseList = !this.showFranchiseList;
  }
}
