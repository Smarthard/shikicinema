import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AnimeFranchiseNode, AnimeFranchiseLink} from '../../../types/franchise';
import {FranchiseService} from '../../../services/franchise/franchise.service';

@Component({
  selector: 'app-franchise-list',
  templateUrl: './franchise-list.component.html',
  styleUrls: ['./franchise-list.component.css']
})

export class FranchiseListComponent implements OnInit {

  constructor(
    private franchiseService: FranchiseService,
    private router: Router,
  ) {}

  franchiseData: AnimeFranchiseNode[] = [];
  showFranchiseList = false;
  isHidden = true;
  userRates: any
  dataFetched = false;
  isLoadingData = false;

  ngOnInit(): void {
    if (!this.dataFetched) {
      this.fetchAndProcessFranchiseData().then(() => {});
    }
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
    const franchiseData: AnimeFranchiseNode[] = nodes.map(node => ({
      id: node.id,
      name: node.name,
      poster: node.image_url,
      year: node.year === null ? 'Анонс' : node.year,
      kind: node.kind === null ? 'Анонс' : node.kind,
      status: '',
    }));

    // Даты по возрастанию (изначально по убыванию)
    franchiseData.reverse();

    // Находим приквел в relation для тайтла и ставим его перед выбраным тайтлом
    franchiseData.forEach(node => {
      const nodeID = node.id;
      const relatedLinks: AnimeFranchiseLink[] = links.filter(link => link.source_id === nodeID);

      // проходим по каждому тайтлу и ищем для него приквел
      relatedLinks.forEach(link => {
        if (link.relation === 'prequel') {
          const prequelID = link.target_id;

          // находим индекс тайтла и приквела
          const sourceIndex = franchiseData.findIndex(item => item.id === nodeID);
          const prequelIndex = franchiseData.findIndex(item => item.id === prequelID);

          // если приквел стоит после тайтла - ставим приквел перед тайтлом
          if (sourceIndex !== -1 && prequelIndex > sourceIndex) {
            const targetItem = franchiseData.splice(prequelIndex, 1)[0];
            franchiseData.splice(sourceIndex, 0, targetItem);
          }
        }
      });
    });

    return franchiseData;
  }

  // Открытие и закрытие списка + подгружаем userRates для отметок
  async toggleFranchiseList(): Promise<any> {
    this.showFranchiseList = !this.showFranchiseList;

    if (!this.userRates) {
      this.isLoadingData = true;
      this.userRates = await this.franchiseService.GraphQL();

      this.franchiseData.forEach(franchise => {
        const matchedAnime = this.userRates.animes.find((
          anime: { id: string; }) =>
            anime.id === franchise.id.toString());

        if (matchedAnime && matchedAnime.userRate !== null) {
          franchise.status = matchedAnime.userRate.status;
        }
      });
      this.isLoadingData = false;
    }
  }

  // Открываем выбранный тайтл
  async openFranchise(animeId: number): Promise<void> {
    const AnimeInfo = await this.franchiseService.GetEpisode(animeId);
    const maxEpisode = AnimeInfo.episodes || AnimeInfo.episodes_aired || 1;
    const watched = +(AnimeInfo.user_rate ? AnimeInfo.user_rate.episodes : 0);
    let episode = AnimeInfo.user_rate && AnimeInfo.user_rate.status === 'completed' ? 1 : watched + 1;

    if (episode > maxEpisode) {
      episode = maxEpisode;
    }
    await this.router.navigate([`/${animeId}/${episode}`]);
    this.showFranchiseList = !this.showFranchiseList;
  }
}
