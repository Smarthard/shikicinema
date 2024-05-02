// Список для: ТВ сериал должен быть первым в хронологии, но он не первый 
const exceptionsFranchises: string[] = ['jojo_no_kimyou_na_bouken', 'hellsing', 'one_piece'];
export { exceptionsFranchises }

export interface FranchiseData {
  id: number;
  name: string;
  kind: string;
  episodes: number;
  episodesAired: number;
  status: string;
  user_status: string;
  user_episodes: number;
  year: number;
  e?: number;
  related: { relationRu: string; anime: { id: string } | null }[];
}
