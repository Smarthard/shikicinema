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
